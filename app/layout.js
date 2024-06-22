import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import 'aos/dist/aos.css';
import "/public/assets/dist/app.css"
import "/public/assets/font/font-awesome.css"
import "/public/assets/dist/swiper-bundle.min.css"
import { Web3ModalProvider } from "@/components/providers/Web3ModalProvider";
import { CollectionProvider } from "@/components/providers/CollectionProvider";
export const metadata = {
  title: 'Aptos Event and ENS Gateway - Get Reward for Joining Aptos Event',
  description: 'Mint Your Generative AI NFT, GPT4o, Dall-e 3.0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="header-fixed">
        <Web3ModalProvider>
          <CollectionProvider>
            {children}
          </CollectionProvider>
        </Web3ModalProvider>
      </body>
    </html>
  )
}
