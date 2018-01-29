var api = (function(){
    "use strict"
    var module = {};

    if(!localStorage.getItem('Comment')){
        localStorage.setItem('Comment', JSON.stringify({next: 0, items: []}));
    }

    if(!localStorage.getItem('image')){
        localStorage.setItem('image', JSON.stringify({next: 0, prop: []}));
    }

    if(!localStorage.getItem('currPage')){
        localStorage.setItem('currPage', JSON.stringify(0));
    }

    module.setPageNum = function(page){
        var currPage = JSON.parse(localStorage.getItem('currPage'));
        currPage = page;
        localStorage.setItem('currPage', JSON.stringify(page));
        return currPage;
    }

    module.getPageNum = function(){
        var currPage = JSON.parse(localStorage.getItem('currPage'))
        return currPage;
    }


    module.addImage = function(url, title, author){
        var image = JSON.parse(localStorage.getItem('image'));
        var prop = {id: image.next++, url: url, title: title, author: author}
        image.prop.push(prop);
        localStorage.setItem('image', JSON.stringify(image));
        return prop;
    }

    module.deleteImage = function(imageId){
        var image = JSON.parse(localStorage.getItem('image'));
        var index = image.prop.findIndex(function(prop){
            return prop.id == imageId;
        });
        if (index == -1) return null;
        var prop = image.prop[index];
        image.prop.splice(index, 1);
        localStorage.setItem('image', JSON.stringify(image));
        return prop;
    }

    module.getImage = function(imageId){
        var image = JSON.parse(localStorage.getItem('image'));
        var index = image.prop.findIndex(function(prop){
            return prop.id == imageId;
        });
        if (index == -1) return null;
        var prop = image.prop[index];
        return prop;
    }

    module.getImages = function(){
        var image = JSON.parse(localStorage.getItem('image'));
        return image.prop;
    }

    module.addComment = function(author, content, date, imageId){
        // store data here
        var Comment = JSON.parse(localStorage.getItem('Comment'));
        var item = {id: Comment.next++, author: author, 
            content: content, date: date, imageId: imageId}
        Comment.items.push(item);
        localStorage.setItem('Comment', JSON.stringify(Comment));
        return item;
    }

    module.deleteComment = function(CommentId){
        var Comment = JSON.parse(localStorage.getItem('Comment'));
        var index = Comment.items.findIndex(function(item){
            return item.id == CommentId;
        });
        if (index == -1) return null;
        var item = Comment.items[index];
        Comment.items.splice(index, 1);
        localStorage.setItem('Comment', JSON.stringify(Comment));
        return item;
    }

    module.getComments = function(imageId, offset=0){
        var Comment = JSON.parse(localStorage.getItem('Comment'));
        var temp_return = [];
        var temp_return2 = [];
        var all_comments = Comment.items;
        for(var i = 0; i < all_comments.length; i++){
            if(all_comments[i].imageId == imageId){
                temp_return2.push(all_comments[i]);
            }
        }

        if(temp_return2.length > 10){
            offset = temp_return2.length - 10;
            temp_return = temp_return2.slice(offset, offset + 10);
        }
        else{
            temp_return = temp_return2;
        }
        return temp_return;

    }

    module.getallComments = function(imageId, offset=0){
        var Comment = JSON.parse(localStorage.getItem('Comment'));
        var temp_return = [];
        var all_comments = Comment.items;
        for(var i = 0; i < all_comments.length; i++){
            if(all_comments[i].imageId == imageId){
                temp_return.push(all_comments[i]);
            }
        }
        return temp_return;
    }

    module.getlength = function(){
        var Comment = JSON.parse(localStorage.getItem('Comment'));
        return Comment.items.length;
    }
    
    
    return module;
})();