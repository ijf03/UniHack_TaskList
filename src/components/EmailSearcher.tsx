const sendEmail = async () => {
    const API_KEY = "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";
    const API_URL = "https://api.brevo.com/v3/smtp/email"; // Brevo (formerly Sendinblue) API URL
  
    const emailData = {
      sender: { name: "Lock TF In", email: "locktfin.tasklist@gmail.com" },
      to: [{ email: "apan0076@student.monash.edu", name: "Aarush Pandey" }],
      subject: "Hi!",
      htmlContent: "<html><body><h1> Hello, this is an email! </h1></body></html>",
    };
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify(emailData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  export default function EmailSender() {
    return (
      <div>
        <h2>Send Email</h2>
        <button onClick={sendEmail}>Send Test Email</button>
      </div>
    );
  }
  