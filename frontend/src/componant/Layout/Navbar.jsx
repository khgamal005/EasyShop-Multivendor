
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'


// eslint-disable-next-line react/prop-types
const Navbar = ({active}) => {
  return (
    <div className="  hidden md:flex  justify-center items-center">
         {
            navItems && navItems.map((i,index) => (
                <div key={index} >
                    <Link to={i.url}
                    className={`${active === index + 1 ? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer}`}
                    >
                    {i.title}
                    </Link>
                </div>
            ))
         }
    </div>
  )
}

export default Navbar