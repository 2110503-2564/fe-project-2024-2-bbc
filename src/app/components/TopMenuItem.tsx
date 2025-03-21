import Link from "next/link";

export default function TopMenuItem({title,pageRef}:{title:string,pageRef:string}){
    return(
        <Link href={pageRef} className="w-[120px] text-center mt-auto mb-auto font-san text-xs text-gray-600 font-extrabold hover:text-blue-500">
            {title}
        </Link>
    );
}