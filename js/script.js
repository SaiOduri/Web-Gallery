(function(){
    "use strict";

    // Initialize Variables used in code

    const today = new Date();
    const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    var current_day = days_of_week[today.getDay()];
    var current_month = months[today.getMonth()];
    var number = today.getDate();
    var url = '';
    var currId = 0;
    var currPage = 0;

    // Inserts comments given a comment object

    function insertComments(Comment){
            var date = current_day + ", " + current_month + " " + number;
            var e = document.createElement('div');
            e.id = "Comment" + Comment.id;
            e.className = "message";
            e.innerHTML=`
                <div class="message_user">
                    <img class="message_picture" src="media/user.png" alt="${Comment.author}">
                    <div class="message_username">${Comment.author}</div>
                </div>
                <div class="message_content">${Comment.content}</div>
                <div class="date icon">${date}</div>
                <div class="delete-icon icon"></div>
            `;
            // Places comment into the HTML
            document.getElementById("messages").prepend(e);


            // Deletes specific comment
            document.getElementsByClassName('delete-icon')[0].addEventListener('click', function(){
                var element = document.getElementById("Comment" + Comment.id);
                api.deleteComment(Comment.id);
                element.parentNode.removeChild(element);
                setCurrPage(currPage);
            })
    }

    // Sets Comments given a list of comments
    function setComments(msg){
        var e = document.createElement('div');
        document.getElementById("messages").innerHTML = '';
            e.className = "Comment";
            if(msg.length > 10){
                for(var i = 0; i <= 9; i++){
                    insertComments(msg[i]);
                }
            }
            else{
                for(var x = 0; x < msg.length; x++){
                    insertComments(msg[x]);
                }
            }
    }

    // Sets an image given an image object
    function setImage(image){
        var images = document.getElementById("Images");
        var e = document.createElement('div');
            e.innerHTML = ` <img src="${image.url}" alt="${image.title}" class = image_size>`;
            e.className = 'image_div'    
            images.replaceChild(e, images.firstElementChild);
        var info = document.getElementById("Information");
        info.innerHTML = `  <div class = "image_info">
                                <h1>Title: ${image.title}</h1>
                                <h1> Author: ${image.author} </h1>
                                </div>`
        var info = document.getElementById("Information");
            info.innerHTML = `  <div class = "image_info">
                                <h1>Title: ${image.title}</h1>
                                <h1> Author: ${image.author} </h1>
                                </div>`
    }


    // Clears the current image from the html
    function ClearImage(){
        var images = document.getElementById("Images");
        images.innerHTML = `<div class = "default">
                                </div>`
        var info = document.getElementById("Information");
        info.innerHTML = ``
        var images = document.getElementById("box2");
            images.style.display = "none";
        var form = document.getElementById("box");
            form.style.display = "none";
    }

    // Clears the Comments in the HTML
    function ClearComments(){
        var comments = document.getElementById("messages");
        comments.innerHTML = ``;
    }

    // Sets the current pages comments in the html
    function setCurrPage(currPage){
        var comment_list = api.getallComments(currId);
        ClearComments();
        var cutNum = (currPage * 10);
        comment_list.reverse();
        comment_list = comment_list.slice(cutNum, cutNum + 10);
        comment_list.reverse();
        setComments(comment_list);
    }



    window.onload = function() {

        // Sets the refresh to first image
        if(api.getImages()[0] !=  null){
            setImage(api.getImages()[0]);
            currId = api.getImages()[0].id;
            var images = document.getElementById("box2");
            images.style.display = "block";
        }

        // Sets the current page of the comments
        currPage = api.getPageNum();
        setCurrPage(currPage);

        // Sets the page number in the HTML
        var pagenumber = document.getElementById("pagenumber");
        pagenumber.innerHTML = `Page ${currPage +1}`;

        // Cannot comment if there is no photo
        if(api.getImages()[0] == null){
            var comments = document.getElementById("box3");
                comments.style.display = "none";
        }


        // Adding a photo
        document.getElementById('add_image_form').addEventListener('submit', function(x){

            x.preventDefault();
            var title = document.getElementById("title_name").value;
            var author = document.getElementById("author_name").value;
            url = document.getElementById("url").value;
            document.getElementById("add_image_form").reset();

            var image = api.addImage(url, title, author, today);
            setImage(image);
            currId = image.id;

            // This code was gotten from w3 schools, I changed it a little
            // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
            var images = document.getElementById("box2");
            images.style.display = "block";

            var comments = document.getElementById("box3");
            if(comments.style.display == "none"){
                comments.style.display = "block";
            }
            ClearComments();
        });

        // Show button toggles the display of the form
        document.getElementById('show').addEventListener('click', function(f){
            f.preventDefault();

            // This code was gotten from w3 schools, I changed it a little
            // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
            var form = document.getElementById("box");
            if(form.style.display == "block"){
                form.style.display = "none";
            }
            else{
                form.style.display = "block";
            }
            
        });


        // Submit a comment
        document.getElementById('create_message_form').addEventListener('submit', function(e){
            e.preventDefault();
            var username = document.getElementById("post_name_2").value;
            var content = document.getElementById("post_content_2").value;
            document.getElementById("create_message_form").reset();
            var Comment = api.addComment(username, content, today, currId);
            setCurrPage(currPage);
        });

        // Delete an image with all it's comments
        document.getElementById('del').addEventListener('click', function(e){
            e.preventDefault();
            var temp_lst = api.getallComments(currId);
            for(var i = 0; i < temp_lst.length; i++){
                if(temp_lst[i] != null){
                    api.deleteComment(temp_lst[i].id);
                    if(document.getElementById("Comment" + temp_lst[i].id) != null){
                        var element = document.getElementById("Comment" + temp_lst[i].id);
                        element.parentNode.removeChild(element);
                    }
                }
            }
            ClearComments();
            // Loops through all the image id's to find current imageId
            var image_list = api.getImages();
            var entered = false;
            for(var i = 0; i < image_list.length; i++){
                if(api.getImages()[i] != null){

                    if(api.getImages()[i].id == currId && entered == false){
                        var commentbox = document.getElementById("box3");
                        // Sets the image to the next image in the list
                        if(image_list[i+1] != null){
                            entered = true;
                            currId = image_list[i+1].id;
                            setImage(image_list[i+1]);
                            setCurrPage(currPage);
                            commentbox.style.display = "block";
                        }
                        // If there's no next, sets to a previous image
                        else if(image_list[i-1] != null){
                            entered = true
                            currId = image_list[i-1].id;
                            setImage(image_list[i-1]);
                            setCurrPage(currPage);
                            commentbox.style.display = "block";
                        }
                        // If there's no next or previous goes to starting options
                        else{
                            entered = true
                            ClearImage();
                            commentbox.style.display = "none";
                        }
                        // Removes the image from the local storage
                        api.deleteImage(image_list[i].id);
                    }
                }

            }
            // Sets the page number to 1 for the next page
            currPage = api.setPageNum(0);
            var pagenumber = document.getElementById("pagenumber");
            pagenumber.innerHTML = `Page ${currPage +1}`;
        })
        
        // Goes to a previous image
        // If you're at the first image, goes to the last image
        document.getElementById('left').addEventListener('click', function(f){
            f.preventDefault();
            var entered = false;
            currPage = api.setPageNum(0);
            for(var i = 0; i < api.getImages().length; i++){
                if(api.getImages()[i].id == currId && entered == false){

                    if(api.getImages()[i-1] != null){
                        entered = true;
                        var image = api.getImages()[i-1];
                        currId = image.id;
                        setImage(image);
                        ClearComments();
                        var comments = api.getComments(currId);
                        setCurrPage(currPage);
                    }
                    else{
                        entered = true;
                        var last_image = api.getImages()[api.getImages().length - 1];
                        currId = last_image.id;
                        setImage(last_image);
                        ClearComments();
                        var comments = api.getComments(currId);
                        setCurrPage(currPage);
                    }
                }
            }
            entered = false;
            var pagenumber = document.getElementById("pagenumber");
            pagenumber.innerHTML = `Page ${currPage +1}`;
        });

        // Goes to the next image
        // If there's no next, it goes to the first image
        document.getElementById('right').addEventListener('click', function(f){
            f.preventDefault();
            var entered = false;
            currPage = api.setPageNum(0);
            for(var i = 0; i < api.getImages().length; i++){
                if(api.getImages()[i].id == currId && entered == false){

                    if(api.getImages()[i+1] != null){
                        entered = true;
                        var image = api.getImages()[i +1];
                        currId = image.id;
                        setImage(image);
                        ClearComments();
                        var comments = api.getComments(currId);
                        setCurrPage(currPage);
                    }
                    else{
                        entered = true;
                        var first_image = api.getImages()[0];
                        currId = first_image.id;
                        setImage(first_image);
                        ClearComments();
                        var comments = api.getComments(currId);
                        setCurrPage(currPage);
                    }
                }
            }
            entered = false;
            var pagenumber = document.getElementById("pagenumber");
            pagenumber.innerHTML = `Page ${currPage +1}`;
            
        });

        // Goes to the previous comment page
        document.getElementById('last_comment_page').addEventListener('click', function(f){
            var comment_list = api.getallComments(currId);
            if(currPage != 0){
                if(comment_list.length > 10){
                    ClearComments();
                    currPage--;
                    api.setPageNum(currPage);
                    setCurrPage(currPage);
                }
                var pagenumber = document.getElementById("pagenumber");
                pagenumber.innerHTML = `Page ${currPage +1}`;
            }
        });

        // Goes to the next comment page
        document.getElementById('next_comment_page').addEventListener('click', function(f){
            var comment_list = api.getallComments(currId);
            if(comment_list.length > ((currPage+1) * 10)){
                ClearComments();
                currPage++;
                api.setPageNum(currPage);
                setCurrPage(currPage);
            }
            var pagenumber = document.getElementById("pagenumber");
            pagenumber.innerHTML = `Page ${currPage +1}`;
        });
    }
}());


