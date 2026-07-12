import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieStatus, Prisma } from '.prisma/generated';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    @InjectQueue('upload') private uploadQueue: Queue,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    this.logger.log(`Creating movie: ${createMovieDto.title}`);
    
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        status: MovieStatus.COMING_SOON,
      },
    });
  }

  async findAll() {
    return this.prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllClient(query: { page?: number; limit?: number; status?: MovieStatus; isFeatured?: string }) {
    const { page = 1, limit = 10, status, isFeatured } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MovieWhereInput = {
      ...(status ? { status } : {}),
      ...(isFeatured !== undefined ? { isFeatured: isFeatured === 'true' } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: isFeatured === 'true'
          ? [{ featuredOrder: 'asc' }, { viewCount: 'desc' }, { releaseDate: 'desc' }]
          : [{ releaseDate: 'desc' }],
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findHotClient(limit = 10) {
    const safeLimit = Math.max(1, Math.min(limit, 20));

    return this.prisma.movie.findMany({
      where: {
        isFeatured: true,
        status: {
          in: [MovieStatus.NOW_SHOWING, MovieStatus.COMING_SOON],
        },
      },
      take: safeLimit,
      orderBy: [
        { featuredOrder: 'asc' },
        { viewCount: 'desc' },
        { averageRating: 'desc' },
        { releaseDate: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    this.logger.log(`Updating movie: ${id}`);
    
    const oldMovie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!oldMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    if (updateMovieDto.posterUrl && updateMovieDto.posterUrl !== oldMovie.posterUrl) {
      await this.uploadQueue.add('deleteFile', { url: oldMovie.posterUrl });
    }

    if (updateMovieDto.trailerUrl && updateMovieDto.trailerUrl !== oldMovie.trailerUrl) {
      await this.uploadQueue.add('deleteFile', { url: oldMovie.trailerUrl });
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }
}
