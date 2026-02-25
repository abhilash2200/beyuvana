interface HeaderProps {
  heading: string;
  textalign: string;
  textcolor: string;
}

export default function HeaderText({
  heading,
  textalign,
  textcolor,
}: HeaderProps) {
  return (
    <h2
      className={`md:text-[30px] text-[25px] font-[Grafiels] leading-tight md:mb-4 mb-2 ${textalign} ${textcolor}`}
    >
      {heading}
    </h2>
  );
}
