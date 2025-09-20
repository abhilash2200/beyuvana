"use client"

interface HeaderProps {
    heading: string;
    textalign: string;
    textcolor: string;
}

const HeaderText = ({ heading, textalign, textcolor } : HeaderProps) => {
  return (
    <h2 className={`md:text-[30px] text-[25px] font-[Grafiels] leading-tight mb-4 ${textalign} ${heading} ${textcolor} }`}>
        {heading}
    </h2>
  )
}

export default HeaderText