type CampusIllustrationProps = {
  className: string;
  label: string;
  titleId: string;
};

export function CampusIllustration({
  className,
  label,
  titleId,
}: CampusIllustrationProps) {
  return (
    <svg
      aria-labelledby={titleId}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 1200 675"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{label}</title>
      <rect width="1200" height="675" fill="#e5eef0" />
      <circle cx="970" cy="126" r="52" fill="#e9c878" />
      <path
        d="M0 344 180 214l174 130 170-180 230 180 190-152 256 152v130H0z"
        fill="#bdcfca"
      />
      <path
        d="m0 382 214-126 174 126 181-105 213 105 194-117 224 117v92H0z"
        fill="#9fb9b3"
      />
      <path d="M0 426h1200v249H0z" fill="#d6e2d6" />
      <path
        d="M234 431V265l52-45h474l55 45v166z"
        fill="#f8f5eb"
        stroke="#c3c8c1"
        strokeWidth="5"
      />
      <path d="m215 270 310-145 313 145z" fill="#245b78" />
      <path d="M511 126h28v111h-28z" fill="#d6a84f" />
      <path
        d="M280 287h72v66h-72zm111 0h72v66h-72zm111 0h72v66h-72zm111 0h72v66h-72zm-333 91h72v53h-72zm111 0h72v53h-72zm222 0h72v53h-72z"
        fill="#8db6b8"
      />
      <path d="M486 347h88v84h-88z" fill="#245b78" />
      <path d="M0 458h1200" stroke="#a8bbaa" strokeWidth="6" />
      <path d="M470 675 570 453h142l98 222z" fill="#e9dfca" />
      <path d="M0 604h1200" stroke="#c1d0c1" strokeWidth="4" />
      <path
        d="M116 447v132m-31-82h64m-58-30h52"
        stroke="#567f70"
        strokeLinecap="round"
        strokeWidth="11"
      />
      <circle cx="116" cy="412" r="51" fill="#719681" />
      <path
        d="M1060 449v133m-31-81h64m-58-31h52"
        stroke="#567f70"
        strokeLinecap="round"
        strokeWidth="11"
      />
      <circle cx="1060" cy="414" r="54" fill="#719681" />
      <g
        stroke="#142b45"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      >
        <circle cx="682" cy="491" r="18" fill="#c98c66" />
        <path d="M665 487q17-27 35 0" fill="#142b45" />
        <path d="m667 516-20 56 41 6 16-50" fill="#2d827b" />
        <path
          d="m655 534-27 35m68-34 22 31m-56 11-5 49m32-46 17 47"
          fill="none"
        />
        <circle cx="782" cy="506" r="17" fill="#ad7255" />
        <path d="M766 502q16-25 33 0" fill="#142b45" />
        <path d="m767 529-15 49 39 8 13-48" fill="#d6a84f" />
        <path
          d="m758 544-21 31m63-33 21 32m-58 12-2 44m29-40 17 43"
          fill="none"
        />
      </g>
    </svg>
  );
}
