import Header from "../../Shared/Components/Header/header";
import imgRecipesList from '/RecipesList.png'

export default function CategoriesList() {
  return (
    <>
      <Header imgPath={imgRecipesList} title={'Categories List'} 
     desc={
          <>
            <span>You can now add your items that any user can order it from the Application and you can edit</span>
            <br />
            <span>the Application and you can edit</span>
          </>
        } />
       </>
  )
}
