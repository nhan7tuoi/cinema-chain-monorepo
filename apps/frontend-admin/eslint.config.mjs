import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      // 1. Cấm tiệt console.log ở môi trường production để tránh lộ dữ liệu
      "no-console": "error",

      // 2. Tắt luật gốc của JavaScript để dùng luật chuyên biệt của TypeScript ở dưới
      "no-unused-vars": "off",

      // 3. Cấm tuyệt đối việc import thừa hoặc khai báo biến mà không sử dụng
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Bỏ qua nếu tham số có dấu gạch dưới (Ví dụ: _event, _context)
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
