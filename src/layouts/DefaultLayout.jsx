import { Container } from 'react-bootstrap'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'
import PropTypes from 'prop-types'

function DefaultLayout({ children }) {
    return (
        <Container fluid className='px-0 container-main '>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </Container>
    )
}
DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default DefaultLayout