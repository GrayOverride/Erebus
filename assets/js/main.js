var ckey = "c49ac9fa18e05c75fee4918479de1195";
var secret = "b0b0d4689476c9d1";
var gallery = [];
var selects = 0;
var selected = [{}];

function gallerybtn(){
    if(selects >=1){
        document.getElementById('addgallery').innerHTML="Add selected to Gallery"
    }
    if(selects == 0){
        document.getElementById('addgallery').innerHTML="nothing selected"
    }
}

//catch the enterkey, mostly for this developers sanity during debug
document.onkeypress = enter;
function enter(e){
    if (e.which == 13){displayImg()}
}

//define xml get function
function httpGet(url)
{


    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",url,false);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
Array.prototype.contains = function(k) {
    for(var i=0; i < this.length; i++){
        if(this[i] === k){
            return true;
        }
    }
    return false;
};

function clearResults(divID)
{
    document.getElementById(divID).innerHTML = "";
}
function flickrsearch(searchvar,perPage,imgsize) {
    var searchresult = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + ckey + "&text=" + searchvar+"&per_page="+perPage);
    clearResults("containerTwo");
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(searchresult, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(searchresult);

    }
    anchor = document.getElementById("containerTwo");
    for (index = 0; index < xmlDoc.getElementsByTagName("photo").length; ++index) {

        imgFarm = xmlDoc.getElementsByTagName("photo")[index].getAttribute("farm");
        imgServer = xmlDoc.getElementsByTagName("photo")[index].getAttribute("server");
        imgId = xmlDoc.getElementsByTagName("photo")[index].getAttribute("id");
        imgSecret = xmlDoc.getElementsByTagName("photo")[index].getAttribute("secret");


        image = document.createElement('img');
        image.setAttribute('id',imgId);

        image.setAttribute('onclick','selectImage(this);');
        image.setAttribute('src',"https://farm"+imgFarm+".staticflickr.com/"+imgServer+"/"+imgId+"_"+imgSecret+"_"+imgsize+".jpg");
        anchor.appendChild(image)

    }

}

function selectImage(imgID){

    if(imgID.className == "selected") {

        imgID.className = "";
        for(var i = 0; i < selected.length; i++) {
            if(selected[i].id == imgID.id) {
                selected.splice(i, 1);
                break;
            }
        }
        selects = selects - 1;
        gallerybtn()

    } else{
        imgID.className="selected";

        selected.push({id:imgID.id});
        selects = selects + 1;
        gallerybtn()
        }



}
function addToGallery(){
    for(var i = 0; i < selected.length; i++) {
        if(gallery.contains(selected[i].id)) {

        }else{
            gallery.push(selected[i].id);

        }
    }



}
function displayLargeImage(imageID){
    var image = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+ckey+"&photo_id="+imageID);
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(image, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(image);

    }
    var original = xmlDoc.getElementsByTagName("size").length;

    var imgSource = xmlDoc.getElementsByTagName("size")[original-1].getAttribute("source");//fetch largest possible image, THERE ARE NO BREAKS ON THIS TRAIN!
    anchor = document.getElementById("containerTwo");
    large = document.createElement('img');
    large.setAttribute('id',imgId);
    large.setAttribute('onclick','clearResults("containerTwo");');
    large.setAttribute('src',imgSource);
    large.setAttribute('class',"large");
    anchor.appendChild(large)

}
function showGallery(){
    clearResults("containerTwo");
    for (index = 1; index < gallery.length; ++index) {

        var image = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+ckey+"&photo_id="+gallery[index]);
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(image, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(image);
        }
        anchor = document.getElementById("containerOne");
        imgSource = xmlDoc.getElementsByTagName("size")[0].getAttribute("source");
        image = document.createElement('img');
        image.setAttribute('id',gallery[index]);
        image.setAttribute('onclick','displayLargeImage(this.id);');
        image.setAttribute('src',imgSource);
        anchor.appendChild(image)
    }


}
function displayImg(){
    var sInput = document.getElementById('searchInput').value;
    var sAmount = document.getElementById('searchAmount').value;
    var sSize = document.getElementById('searchSize').value;

    flickrsearch(sInput,sAmount,sSize)

}
