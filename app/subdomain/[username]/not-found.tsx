import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <style>{`
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          
          .container {
            max-width: 600px;
            padding: 2rem;
          }
          
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          p {
            margin-bottom: 2rem;
          }
          
          a {
            color: #3b82f6;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/">Return to Home</Link>
        </div>
      </body>
    </html>
  )
}
