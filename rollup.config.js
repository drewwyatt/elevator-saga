import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.ts',
  output: {
    file: 'out.js',
    format: 'es',
  },
  plugins: [typescript()],
}
