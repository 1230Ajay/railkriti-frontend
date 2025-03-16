import NavBar from "@/components/nav/navbar";
import { Titles } from "@/lib/data/title";

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const additionalData = "Some Value"; // Define additional variables
  
    return (
      <html lang="en">
        <body className=" h-screen">
         <NavBar title={Titles.BrWlmsTitle} ></NavBar>
          {children}
    
        </body>
      </html>
    );
  }
  