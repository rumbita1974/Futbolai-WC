export default function handler(req: any, res: any) {
  res.status(200).json({
    filePath: __filename,
    dirname: __dirname,
    aiFiles: 'Check structure'
  });
}