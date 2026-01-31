
interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
  artwork?: string;
  subject?: string;
}

export const ContactFormEmail = ({
  name,
  email,
  message,
  artwork,
  subject,
}: ContactFormEmailProps) => {
  const previewText = `Ny besked fra ${name}`;

  return (
    <html lang="da">
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{previewText}</title>
        <style>{`
          body {
            background-color: #f6f9fc;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
          }
          .container {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px 0 48px;
            margin-bottom: 64px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            max-width: 580px;
          }
          .heading {
            font-size: 28px;
            font-weight: bold;
            margin-top: 0;
            text-align: center;
            color: #0d1a2e;
            padding: 0 20px;
          }
          .sub-heading {
            font-size: 20px;
            font-weight: bold;
            margin-top: 0;
            color: #0d1a2e;
            padding: 0 20px;
          }
          .paragraph {
            font-size: 16px;
            line-height: 26px;
            color: #3c4858;
            padding: 0 20px;
          }
          .message-box {
            font-size: 16px;
            line-height: 26px;
            color: #3c4858;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            background-color: #fbfbfb;
            margin: 0 20px;
          }
          .link {
            color: #4f46e5;
          }
          .hr {
            border: none;
            border-top: 1px solid #f0f0f0;
            margin: 20px 0;
          }
        `}</style>
        {/* Preview text for email clients */}
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
          {previewText}
        </div>
      </head>
      <body>
        <div className="container">
          <h1 className="heading">Ny besked fra din hjemmeside</h1>
          <div className="paragraph">Du har modtaget en ny besked fra kontaktformularen på din kunsthjemmeside.</div>

          {artwork && (
            <div className="paragraph">
              <strong>Interesse i kunstværk:</strong> {artwork}
            </div>
          )}

          {subject && (
            <div className="paragraph">
              <strong>Emne:</strong> {subject}
            </div>
          )}

          <hr className="hr" />

          <div className="paragraph">
            <strong>Afsender:</strong> {name}
          </div>
          <div className="paragraph">
            <strong>Email:</strong> <a href={`mailto:${email}`} className="link">{email}</a>
          </div>

          <hr className="hr" />

          <h2 className="sub-heading">Besked:</h2>
          <div className="message-box">
            {message.split('\n').map((line, index) => (
              <p key={index} style={{ margin: 0 }}>{line}</p>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
};
