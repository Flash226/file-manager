import fs from 'fs';
import crypto from 'crypto';

const calculateHash = (filePath) => {
  const algorithm = 'sha256';
  const hash = crypto.createHash(algorithm);

  try {
    const fileData = fs.readFileSync(filePath);
    hash.update(fileData);

    const fileHash = hash.digest('hex');
    console.log('Hash:', fileHash);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Invalid input: File not found:', filePath);
    } else {
      console.log('Error reading file:', error.message);
    }
  }
};

export { calculateHash };
