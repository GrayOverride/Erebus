var ckey = "c49ac9fa18e05c75fee4918479de1195";
var secret = "b0b0d4689476c9d1";
var gallery = [];
var selected = [{}];
//catch the enterkey, mostly for this developers sanity during debug
document.onkeypress = enter;
function enter(e) {
    if (e.which == 13) {
        displayImg()
    }
}
//define xml get function
function httpGet(url) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
Array.prototype.contains = function (k) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === k) {
            return true;
        }
    }
    return false;
};
function clearResults(divID) {
    document.getElementById(divID).innerHTML = "";
}
function flickrsearch(searchvar, perPage, imgsize) {
    selected = [{}];
    var searchresult = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + ckey + "&text=" + searchvar + "&per_page=" + perPage);
    clearResults("containerOne");
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
        image.setAttribute('id', imgId);
        image.setAttribute('onclick', 'selectImage(this);');
        image.setAttribute('src', "https://farm" + imgFarm + ".staticflickr.com/" + imgServer + "/" + imgId + "_" + imgSecret + "_" + imgsize + ".jpg");
        anchor.appendChild(image)
    }
}
function selectImage(imgID) {
    var d = document.getElementById('addgallery');
    d.className = "visible";
    if (imgID.className == "selected") {

        imgID.className = "";
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].id == imgID.id) {
                selected.splice(i, 1);
                break;
            }
        }
    } else {
        imgID.className = "selected";
        selected.push({id: imgID.id});
    }
}
function addToGallery() {
    var d = document.getElementById('gallery');
    d.className = "visible";
    for (var i = 0; i < selected.length; i++) {
        if (gallery.contains(selected[i].id)) {
        } else {
            gallery.push(selected[i].id);
        }
    }
}
function displayLargeImage(imageID) {
    clearResults("containerTwo");
    var image = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + ckey + "&photo_id=" + imageID);
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
    var imgSource = xmlDoc.getElementsByTagName("size")[original - 1].getAttribute("source");//fetch largest possible image, THERE ARE NO BREAKS ON THIS TRAIN!
    anchor = document.getElementById("containerTwo");
    large = document.createElement('img');
    large.setAttribute('id', imgId);
    large.setAttribute('onclick', 'clearResults("containerTwo")');
    large.setAttribute('src', imgSource);
    large.setAttribute('class', "large");
    anchor.appendChild(large)
}
function showGallery() {
    var k = document.getElementById("gallery");
    k.className = "hidden";
    var d = document.getElementById("controls");
    d.className = "colum-lg hidden";
    var b = document.getElementById("back");
    b.className = "visible";
    clearResults("containerTwo");
    for (index = 1; index < gallery.length; ++index) {

        var image = httpGet("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + ckey + "&photo_id=" + gallery[index]);
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
        image.setAttribute('id', gallery[index]);
        image.setAttribute('onclick', 'displayLargeImage(this.id);');
        image.setAttribute('src', imgSource);
        anchor.appendChild(image)
    }
}
function newSearch() {
    var c = document.getElementById("addgallery");
    c.className = "hidden";
    var k = document.getElementById("gallery");
    k.className = "visible";
    var d = document.getElementById("controls");
    d.className = "colum-lg visible";
    var b = document.getElementById("back");
    b.className = "hidden";
    clearResults("containerOne");
    clearResults("containerTwo");
}
function displayImg() {
    var sInput = document.getElementById('searchInput').value;
    var sAmount = document.getElementById('searchAmount').value;
    var sSize = document.getElementById('searchSize').value;
    flickrsearch(sInput, sAmount, sSize)
}
