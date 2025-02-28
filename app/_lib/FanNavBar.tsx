export default function FanNavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark w-100 opacity-75" style={{ margin: '0 auto', width: '100%' }}>
        <div className="container-fluid">
            <div className="d-flex justify-content-center align-text-center w-100 align-items-stretch">
                <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/home-fan'}   
              >Home</button>
                <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/club-finder'}
                >Club Finder</button>
                <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/match-finder'}
                >Match Finder</button>
                <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/fan-orders'}
                >My Tickets</button>
                <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/fan-profile'}
                >My Profile</button>
            </div>
        </div>
    </nav>
);
}