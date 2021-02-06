const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : `https://amazoflix-git-server-side-render.railsonol.vercel.app`