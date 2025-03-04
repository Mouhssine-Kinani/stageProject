import "./header.css";
export default function Header() {
  return (
    <header className="bg-[#fff] text-black p-4 area-header">
      <div class="div1">
        <img src="/headerIcon/side.svg" alt="" />
        <img src="/headerIcon/star.svg" alt="" />
        <p>dashborad / digital products</p>
      </div>
      <div class="div2">
        <input type="text" placeholder="      Search" className="search-input" />
        <div className="iconsHolder">
          <img src="/headerIcon/them.svg" alt="little sun" />
          <img src="/headerIcon/history.svg" alt="" />
          <img src="/headerIcon/notification.svg" alt="" />
          <img src="/headerIcon/side.svg" alt="" />
        </div>
      </div>
    </header>
  );
}
