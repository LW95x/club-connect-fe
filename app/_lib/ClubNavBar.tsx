export default function ClubNavBar() {
    return (
      <nav className="navbar navbar-dark bg-dark w-100" style={{ margin: '0 auto', width: '100%' }}>
          <div className="container-fluid">
              <div className="d-flex justify-content-center align-text-center w-100 align-items-stretch">
                  <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/home-club'}   
                >Home</button>
                  <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/club-matches'}
                  >My Matches</button>
                  <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/add-match'}
                  >Add Match</button>
                  <button className="btn btn-dark border-0" style={{ width: "200px", height: "60px"}} onClick={() => window.location.href='/club-profile'}
                  >My Profile</button>

              </div>
          </div>
      </nav>
  );
  }