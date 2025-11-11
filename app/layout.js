export const metadata = {
  title: 'Instagram Art Agent - Pembuat Seni Gambar Manusia',
  description: 'Agent otomatis untuk membuat dan mengunggah gambar seni manusia ke Instagram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
