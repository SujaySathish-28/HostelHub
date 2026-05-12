import './404.css'
import errorImage from '../assets/404-illustration.svg'

const Error404 = () => {
    return (
        <div className='container'>
            <div className='visual'>
                <img src={errorImage} alt='404 illustration' className='errorImage' />
            </div>
            <h1 className='error404'>404 — Page Not Found</h1>
            <p className='para'>The page you're looking for doesn't exist or has moved. Use the button below to return to the homepage.</p>
            <a className='homeLink' href='/'>Back to Home</a>
        </div>
    )
}

export default Error404;