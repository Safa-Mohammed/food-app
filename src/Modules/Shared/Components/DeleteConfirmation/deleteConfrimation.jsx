import imgGril from "/Gril.png";

export default function DeleteConfrimation({deleteItem}) {
  return (
    <>
  <div className='text-center'>
  <img src={imgGril} className="w-50 mb-3" alt="Delete Illustration" />
            <h4 className="mb-3">Delete This {deleteItem}?</h4>
            <p className="mb-4">
              Are you sure you want to delete this item? If you are sure just click
              on delete it.
            </p>
  </div>
            </>
  )
}
