import { Button } from "@/components/ui/button";

type Props = {
  href: string;
};

export default function WhatsAppOrderButton({ href }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      <Button
        size="lg"
        className="w-full rounded-full bg-[#25D366] text-black hover:bg-[#25D366]/90"
      >
        Place Order on WhatsApp
      </Button>
    </a>
  );
}