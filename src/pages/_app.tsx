import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Any additional setup or global logic can be added here

  return <Component {...pageProps} />;
};

export default MyApp;
