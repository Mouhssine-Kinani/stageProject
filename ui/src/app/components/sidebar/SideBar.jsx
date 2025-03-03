import Link from "next/link";

function SideBar() {
  return (
    <>
      <aside className="bg-gray-800 text-white p-4 area-sidebar">
        <div className="">profile</div>
        <div>
          <ul>
            <li>
              <Link href= "">about</Link>
            </li>
            <li>
              <Link href= "">about</Link>
            </li>
            <li>
              <Link href= "">about</Link>
            </li>
            <li>
              <Link href= "">about</Link>
            </li>
            <li>
              <Link href= "">about</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
