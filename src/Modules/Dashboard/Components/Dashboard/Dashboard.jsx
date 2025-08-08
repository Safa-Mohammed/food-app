import Header from '../../../Shared/Components/Header/header'
import imgDashoard from '/Group 48102127.png'

export default function Dashboard({loginData}) {
  return (
       <>
      <Header
        imgPath={imgDashoard}
        title={`Welcome ${loginData?.userName} !`}
        desc={
          <>
            <span>This is a welcoming screen for the entry of the application,</span>
            <br />
            <span>You can now see the options</span>
          </>
        }
      />

      Dashboard content
    </>
  )
}
