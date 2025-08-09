import imgGril from '/Gril.png'

export default function NoData() {
  return (
    <div className=" text-center">
      <img src={imgGril} alt="" />
      <h5>No data</h5>
      <p>are you sure you want to delete this item ? if you are sure  <br />just click on delete it</p>
    </div>
  )
}
