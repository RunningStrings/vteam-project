import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <ul className="green-button">
        <CustomLink to="/"><ion-icon name="home-outline"></ion-icon>Hem</CustomLink>
        <CustomLink to="/Rent"><ion-icon name="bike-outline"></ion-icon>Hyra</CustomLink>
        <CustomLink to="/User">Användare</CustomLink>
        <CustomLink to="/Maps">Karta</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

/*<Link to="/" className="site-title">
Site Name
</Link>*/
