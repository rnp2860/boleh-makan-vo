import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

const envOrder = ['.env.local', '.env'];

envOrder.forEach((file) => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
  }
});

