var movieNameElement = document.getElementById("movie-name");
var searchbtn = document.getElementById("Search-btn");
let moviecontainer = document.getElementById("movie-container");
let movieStatusElement=document.getElementById("movie-status");
searchbtn.addEventListener( "click", function(){
    var movieName = movieNameElement.value;
    var xhttp = new XMLHttpRequest();
    
    moviecontainer.innerHTML= " ";
    movieStatusElement.innerText= " ";
    movieStatusElement.textContent = " Please wait for sometime...";

    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4){
            movieStatusElement.textContent = " ";
            let result = JSON.parse(this.responseText);
            if(result.Response == "True"){
             
            result.Search.map((item,i) => {
                moviecontainer.innerHTML += 
               ` <div class="moviecard">

          <img 
          class="image"
          src=  ${item.Poster}/>
          <p> <b>Title : </b> <b> ${item.Title}</b></p>   
          <p> <b>Released year : </b> <b>${item.Year}</b></p>
          <p> <b>Type : </b> <b> ${item.Type} </b></p>

        </div> `
            })

}else if(result.Response == "False"){
    movieStatusElement.innerText = "404 error Movies Not Found!!!"
}
}
} 

    xhttp.open("GET",` https://www.omdbapi.com/?apikey=45f0782a&s=${movieName}` ,true);
    xhttp.send(); 
});