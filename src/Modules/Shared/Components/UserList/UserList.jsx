import Header from "../Header/header";
import imgRecipesList from '/RecipesList.png';

export default function UserList() {
  return (
    <>
      <Header 
        imgPath={imgRecipesList} 
        title="User List"
        desc={
          <>
            <span>You can now add your items that any user can order it from the Application and you can edit</span>
            <span>the Application and you can edit</span>
          </>
        }
      />
    </>
  );
}
