import { useEffect } from "react";

type PageProps = {
    title?: string;
    children: React.ReactNode;
}

const Page = (props: PageProps) => {
  useEffect(() => {
    document.title = props.title + " - FlightBooker" || "FlightBooker";
  }, [props.title]);
  return props.children;
};

export default Page;