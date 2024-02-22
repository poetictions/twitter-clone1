$('#postArea','#replyArea' ).keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    var isModal = textbox.parents(".modal").length == 1;
    var submitButton = isModal ? $("#submitReplyButton"): $("#submitPostButton");

    if (submitButton.length ==0) return alert("Button not found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }
})

$('#submitButton','#submitReplyCutton').click((event) => {
    var button = $(event.target);

    var isModal = button.parents(".modal").length ==1;
    var textbox = isModal ? $('#replyArea') : $("#postTextarea");


    var data = {
        content: textbox.val()
    }


    if (isModal) {
        var id = button.data().id();
        if(id == null) return alert("Null ID");
        data.replyTo = id;




    }

    $.post("/api/posts", data, postData => {
        if(postData.replyTo) {
            location.reload();

        }
        else {
            var html = createPostHTML(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");

        }
        

    })
})

$('#replyModal').on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("$submitReplyButton").data("id", postId)


    $.get("/api/posts" + postId, results => {
        outputPosts(results.postData, $(".postsContainer"));

    })
})


$('#replyModal').on("hidden.bs.modal", () => {
    $('#originalPostContainer').html("")
    
})


$(document).on("click", ".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    $ajax({
        url: "/api/posts",
        type: "PUT", 
        success: (postData) => {
            console.log(postData);
        }
    })
})

$(document).on("click", ".post", (event) => {
    var element = $(event.target);
    var postId = getPostIdFromElement(element);

    if(postId != undefined && !element.is("button")) {
        window.location.href = "/post/" + postId;

    }
    
});



function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().Id;

    if(postId === undefined) return alert("Post ID undefined");

    return postId;
}
    


function createPostHTML(postData) {
    if (postData == null) return alert("post is null");


    var postedBy = postData.postedBy;
    if (postedBy._id == undefined) {
        return console.log("Not populated :(");

    }

    var displayName = postedBy.fullname;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    
    var replyFlag = "";

    if (postData.replyTo && postData.replyTo.id) {
        if (!postData.replyTo._id) {
            return alert("Error");
        }

        if (!postData.replyTo._id.postedBy) {
            return alert("Error");
        }

        var replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = html("");

    }
    
    
    return postData.content;

}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         if(elapsed/1000 < 30) return "Just now";
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<h1> nothing </h1>")
    }


}

function outputPostsWithReplies(results, container) {
    container.html("");

    if (results.replyTo != undefined && results.replyTo._id != undefined) {
        var html = createPostHtml(results.replyTo)
        container.append(html)
        
    }

    var mainPostHtml = createPostHtml(results.postData)
    container.append(mainPostHtml);



    results.relies.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });


}
