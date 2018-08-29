function initdata(){
    jQuery.when(jQuery.ajax({
        type:'GET',
        url:'https://jsonplaceholder.typicode.com/posts',
        dataType: 'json',
        success:function(data){
            localStorage.setItem("posts",JSON.stringify(data));
            console.log(data);
        },
        error:function(err){
            console.log(err);
        }
    }),
    jQuery.ajax({
        type:'GET',
        url:'https://jsonplaceholder.typicode.com/users',
        dataType: 'json',
        success:function(data){
            console.log("user sucess");
            var users={};
            for(user in data){
                users[data[user].id]=data[user];
            }
            localStorage.setItem("users",JSON.stringify(users));
        },
        error:function(err){
            console.log(err);
        }
    }),
    jQuery.ajax({
        type:'GET',
        url:'https://jsonplaceholder.typicode.com/comments',
        dataType: 'json',
        success:function(data){
            console.log("user comments");
            localStorage.setItem("comments",JSON.stringify(data));
        },
        error:function(err){
            console.log(err);
        }
    })).done(loadpost);
    
    
    jQuery('#loaddata').remove();
    
    jQuery("body").prepend('<button id="cleardata">clear</button>');
    jQuery("body").prepend('<button id="createpost">post</button>');
    //loadpost();
}
jQuery(document).on('click','#loaddata',initdata);

function loadpost(){
    console.log(localStorage);
    var postlist=JSON.parse(localStorage.getItem("posts") || "[]");
    var userlist=JSON.parse(localStorage.getItem("users") || "[]");
    var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
    console.log(postlist);
    // if(postlist.length===0){
    //      postlist=JSON.parse(localStorage["posts"]|| "[]");
    //      console.log("gggggggggg")+postlist;
    // }
    for(var post=0 in postlist){
            //console.log(postlist[post]);
        if(postlist[post].userId in userlist){
            jQuery('#postarea').prepend('<div id="postdiv_'+postlist[post].id+'"></div>');
            var pdiv=jQuery('#postdiv_'+postlist[post].id);
            pdiv.attr('name',postlist[post].id);
            pdiv.css({"border-width":"3px","border-style":"solid","padding":"8px","margin":"8px"});
            pdiv.append('<p>'+'userName: '+userlist[postlist[post].userId].name+'</p>');
            pdiv.append('<p>'+'Title: '+postlist[post].title+'</p>');
            pdiv.append('<p>'+'Description: '+postlist[post].body+'</p>');
            pdiv.append('<div id="editp_'+postlist[post].id+'"></div>');
            pdiv.append(jQuery('<button>delete</button>').click(function(){
                
                for(var i in postlist){
                    if(postlist[i].id===parseInt(jQuery(this).parent().attr("name"))){
                        console.log("yes");
                        postlist.splice(i, 1);
                        localStorage.posts=JSON.stringify(postlist);
                        break;
                    }
                }
                jQuery(this).parent().remove('div');
            }));
            pdiv.append(jQuery('<button>edit</button>').click(function(){
                if(jQuery(this).html()==="edit"){

                    var dia=jQuery('<div id="createarea"></div>');
                    dia.html(
                        `
                        <input type="text" id="e_uid" placeholder="userid" /input>
                        <input type="text" id="e_title" placeholder="title" /input>
                        <input type="text" id="e_dcr" placeholder="description" /input>
                        <button id="editsub">submit</button>
                        `
                    );
                    dia.css({"border-width":"3px","border-style":"solid","padding":"5px","margin":"7px"});
                    jQuery('#editp_'+jQuery(this).parent().attr("name")).append(dia);
                    console.log(jQuery(this).parent().attr("name"));
                    jQuery(this).html("cancel");


                    var postlist=JSON.parse(localStorage.getItem("posts") || "[]");
                    var userlist=JSON.parse(localStorage.getItem("users") || "[]");
                    var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
                
                    var userid=jQuery(this).parent().attr("name");
                    var i=0;
                    if(jQuery("#e_uid").val() in userlist){
                        
                        for(i in postlist){
                            if(postlist[i].id===userid)
                                break;
                        }
                    }
                    
                    jQuery("#e_uid").val(postlist[i].userId);
                    jQuery("#e_title").val(postlist[i].title); 
                    jQuery("#e_dcr").val(postlist[i].body);
                    console.log("ok from 1");
                    // jQuery('#e_uid').val("hiiiii");
                }else{
                    jQuery(this).html("edit");
                    jQuery('#editp_'+jQuery(this).parent().attr("name")).empty();
                }


            }));

            var showbtn=jQuery('<button>show</button>');
            showbtn.attr('name',postlist[post].id);
            showbtn.attr('id','sbtn_'+postlist[post].id);
            showbtn.click(function(){
                if(jQuery(this).html()==="show"){
                    loadcomment(this);
                    jQuery(this).html("hide");
                }
                else{
                    jQuery(this).html("show");
                    
                    var com=jQuery(this).parent().find('div');
                    
                    for(var c in com){
                        if(com[c].id!=undefined&&com[c].id.includes('comid'))
                            jQuery('#'+com[c].id).remove();
                    }
                }
            });
            pdiv.append(showbtn);


            var crebtn=jQuery('<button>create comment</button>');
            crebtn.attr('name',postlist[post].id);
            crebtn.attr('id','crebtn_'+postlist[post].id);
            crebtn.click(function(){
                if(jQuery(this).html()==="create comment"){
                    createcomment(this);
                    jQuery(this).html("cancel");
                }
                else{
                    jQuery(this).html("create comment");
                    
                    var com=jQuery(this).parent().find('div');
                    
                    for(var c in com){
                        if(com[c].id!=undefined&&com[c].id.includes('cretdiv_'))
                            jQuery('#'+com[c].id).empty();
                    }
                }
            });
            pdiv.append(crebtn);
            //var thisid=postlist[post].id;
            pdiv.append('<div id="cretdiv_'+postlist[post].id+'"></div>');

        }
    }
   

    function loadcomment(cur){
        commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
        var curcomment=commentlist.filter(x => x.postId === parseInt(cur.name));
        //console.log(typeof(cur.name));
        for(var i in curcomment){
            
            var cdiv=jQuery('<div></div>');
            cdiv.attr("id",'comid_'+curcomment[i].id);
            cdiv.attr('name',curcomment[i].id);
            cdiv.css({"border-width":"3px","border-style":"solid","background":"lightgray"});
            cdiv.append('<p>'+'comment name: '+curcomment[i].name+'</p>');
            cdiv.append('<p>'+'email: '+curcomment[i].email+'</p>');
            cdiv.append('<p>'+'Description: '+curcomment[i].body+'</p>');
            if(curcomment[i].like){
                cdiv.append(jQuery('<button disabled>like</button>'));
            }else
            cdiv.append(jQuery('<button>like</button>').click(function(){
            
                // console.log(jQuery(this).parent().attr("name"));
                // console.log(jQuery('#comid_1'));
                for(var j in commentlist){
                    if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                  //      console.log("yes");
                        commentlist[j]['like']=true;
                        console.log(commentlist[j]);
                        localStorage.comments=JSON.stringify(commentlist);
                        break;
                    }
                }
                jQuery(this).prop( "disabled", true );
            }));
            cdiv.append(jQuery('<button>delete</button>').click(function(){
                
                // console.log(jQuery(this).parent().attr("name"));
                // console.log(jQuery('#comid_1'));
                for(var j in commentlist){
                    if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                        console.log("yes");
                        commentlist.splice(j, 1);
                        localStorage.comments=JSON.stringify(commentlist);
                        break;
                    }
                }
                jQuery(this).parent().remove('div');
            }));
            jQuery('#sbtn_'+cur.name).parent().append(cdiv);
        }
    }
    
}


jQuery(document).on('click','#cleardata',function(){
    localStorage.clear();
    jQuery('#cleardata').remove();
    jQuery('#createpost').remove();
    jQuery('#postarea').empty();
    var btn=jQuery('<button id="loaddata">load</button>');
    //btn.click(initdata);
    jQuery("body").append(btn);
    
});
jQuery(document).ready(function (){
if(localStorage.length!=0){
    
    jQuery("body").prepend('<button id="cleardata">clear</button>');
    
    jQuery("body").prepend('<button id="createpost">post</button>');
    loadpost();
}else{
    var btn=jQuery('<button id="loaddata">load</button>');
    
    //btn.click(initdata);
    jQuery("body").append(btn);
}});


jQuery(document).on('click','#createpost',function(){
    if(jQuery('#createpost').html()==='post'){
    var dia=jQuery('<div id="createarea"></div>');
    dia.html(
        `
        <input type="text" id="c_uid" placeholder="userid" /input>
        <input type="text" id="c_title" placeholder="title" /input>
        <input type="text" id="c_dcr" placeholder="describtion" /input>
        <button id="postsub">submit</button>
        `
    );
    dia.css({"border-width":"5px","border-style":"solid","padding":"8px","margin":"8px"});
    jQuery('#postarea').prepend(dia);
    jQuery('#createpost').html('cancel');
    //console.log(jQuery(this));
    }else{
        jQuery('#createarea').remove();
        jQuery('#createpost').html('post');
    }
    //dia.dialog();
});

jQuery(document).on('click','#postsub',function(){
    var postlist=JSON.parse(localStorage.getItem("posts") || "[]");
    var userlist=JSON.parse(localStorage.getItem("users") || "[]");
    var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
    var post={};
    if(jQuery("#c_uid").val() in userlist){
        post["userId"]=jQuery("#c_uid").val();
        post["id"]=postlist[postlist.length-1].id*2+1;
        post["title"]=jQuery("#c_title").val();
        post["body"]=jQuery("#c_dcr").val();
        console.log(post);


        jQuery('#postarea').prepend('<div id="postdiv_'+post.id+'"></div>');
        var pdiv=jQuery('#postdiv_'+post.id);
        pdiv.attr('name',post.id);
        pdiv.css({"border-width":"3px","border-style":"solid","padding":"8px","margin":"8px"});
        pdiv.append('<p>'+'userName: '+userlist[post.userId].name+'</p>');
        pdiv.append('<p>'+'Title: '+post.title+'</p>');
        pdiv.append('<p>'+'Description: '+post.body+'</p>');
        pdiv.append('<div id="editp_'+post.id+'"></div>');
        pdiv.append(jQuery('<button>delete</button>').click(function(){
            
            for(var i in postlist){
                if(postlist[i].id===parseInt(jQuery(this).parent().attr("name"))){
                    console.log("yes");
                    postlist.splice(i, 1);
                    localStorage.posts=JSON.stringify(postlist);
                    break;
                }
            }
            jQuery(this).parent().remove('div');
        }));

        pdiv.append(jQuery('<button>edit</button>').click(function(){
            if(jQuery(this).html()==="edit"){
                var dia=jQuery('<div id="createarea"></div>');
                dia.html(
                    `
                    <input type="text" id="e_uid" placeholder="userid" /input>
                    <input type="text" id="e_title" placeholder="title" /input>
                    <input type="text" id="e_dcr" placeholder="describtion" /input>
                    <button id="editsub">submit</button>
                    `
                );

                // jQuery('#e_uid').val("hiiiii");
                dia.css({"border-width":"5px","border-style":"solid","padding":"8px","margin":"8px"});
                jQuery('#editp_'+jQuery(this).parent().attr("name")).append(dia);

                var postlist=JSON.parse(localStorage.getItem("posts") || "[]");
                var userlist=JSON.parse(localStorage.getItem("users") || "[]");
                var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
               
                var userid=jQuery(this).parent().attr("name");
                var i=0;
                if(jQuery("#e_uid").val() in userlist){
                    
                    for(i in postlist){
                        if(postlist[i].id===userid)
                            break;
                    }
                }
                
                jQuery("#e_uid").val(postlist[i].userId);
                jQuery("#e_title").val(postlist[i].title); 
                jQuery("#e_dcr").val(postlist[i].body);

                console.log("ok from 2");
                jQuery(this).html("cancel");
            }else{
                jQuery(this).html("edit");
                jQuery('#editp_'+jQuery(this).parent().attr("name")).empty();
            }


        }));

        var showbtn=jQuery('<button>show</button>');
        showbtn.attr('name',post.id);
        showbtn.attr('id','sbtn_'+post.id);
        showbtn.click(function(){
            if(jQuery(this).html()==="show"){
                loadcomment(this);
                jQuery(this).html("hide");
            }
            else{
                jQuery(this).html("show");
                
                var com=jQuery(this).parent().find('div');
                
                for(var c in com){
                    if(com[c].id!=undefined&&com[c].id.includes('comid'))
                            jQuery('#'+com[c].id).remove();
                }
            }
        });
        pdiv.append(showbtn);


     
        var crebtn=jQuery('<button>create comment</button>');
        crebtn.attr('name',post.id);
        crebtn.attr('id','crebtn_'+post.id);
        crebtn.click(function(){
            if(jQuery(this).html()==="create comment"){
                createcomment(this);
                jQuery(this).html("cancel");
            }
            else{
                jQuery(this).html("create comment");
                
                var com=jQuery(this).parent().find('div');
                
                for(var c in com){
                    if(com[c].id!=undefined&&com[c].id.includes('cretdiv_'))
                        jQuery('#'+com[c].id).empty();
                }
            }
        });
        pdiv.append(crebtn);
        //var thisid=postlist[post].id;
        pdiv.append('<div id="cretdiv_'+post.id+'"></div>');

        function loadcomment(cur){
            commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
            var curcomment=commentlist.filter(x => x.postId === parseInt(cur.name));
            //console.log(typeof(cur.name));
            for(var i in curcomment){
                
                var cdiv=jQuery('<div></div>');
                cdiv.attr("id",'comid_'+curcomment[i].id);
                cdiv.attr('name',curcomment[i].id);
                cdiv.css({"border-width":"3px","border-style":"solid","background":"lightgray"});
                cdiv.append('<p>'+'comment name: '+curcomment[i].name+'</p>');
                cdiv.append('<p>'+'email: '+curcomment[i].email+'</p>');
                cdiv.append('<p>'+'Description: '+curcomment[i].body+'</p>');
                if(curcomment[i].like){
                    cdiv.append(jQuery('<button disabled>like</button>'));
                }else
                cdiv.append(jQuery('<button>like</button>').click(function(){
            
                    // console.log(jQuery(this).parent().attr("name"));
                    // console.log(jQuery('#comid_1'));
                    for(var j in commentlist){
                        if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                            console.log("yes");
                            commentlist[j]['like']=true;

                        console.log(commentlist[j]);
                            localStorage.comments=JSON.stringify(commentlist);
                            break;
                        }
                    }
                    jQuery(this).prop( "disabled", true );
                }));
                cdiv.append(jQuery('<button>delete</button>').click(function(){
                    
                    // console.log(jQuery(this).parent().attr("name"));
                    // console.log(jQuery('#comid_1'));
                    for(var j in commentlist){
                        if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                            console.log("yes");
                            commentlist.splice(j, 1);
                            localStorage.comments=JSON.stringify(commentlist);
                            break;
                        }
                    }
                    jQuery(this).parent().remove('div');
                }));
                jQuery('#sbtn_'+cur.name).parent().append(cdiv);
            }
        }

        postlist.push(post);
        localStorage.setItem("posts",JSON.stringify(postlist));
        jQuery("#createarea").remove();
        jQuery("#createpost").html("post");
    }else{
        alert("Not a valid user");
    }
});


jQuery(document).on('click','#editsub',function(){
    var postlist=JSON.parse(localStorage.getItem("posts") || "[]");
    var userlist=JSON.parse(localStorage.getItem("users") || "[]");
    var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
    var curid=jQuery(this).parent().parent().parent().attr('name');
    console.log(curid);
    
    if(jQuery("#e_uid").val() in userlist){
        var i=0;
        for(i in postlist){
            if(postlist[i].id===curid)
                break;
        }
        var plist=jQuery("#postdiv_"+curid).find("p");
        console.log(plist[0]);
        postlist[i].userId=jQuery("#e_uid").val();
        jQuery(plist[0]).html(userlist[jQuery("#e_uid").val()].name);
        postlist[i].title=jQuery("#e_title").val();
        postlist[i].body=jQuery("#e_dcr").val();
        jQuery(plist[1]).html(jQuery("#e_title").val());
        jQuery(plist[2]).html(jQuery("#e_dcr").val());
        localStorage.posts=JSON.stringify(postlist)
        var blist=jQuery("#postdiv_"+curid).find("button");
        jQuery(blist[2]).html("edit");
        jQuery('#editp_'+curid).empty();
    }
    else{
        alert("Not a vaild user");
    }

});

function createcomment(curbtn){
    var dia=jQuery('<div id="createarea"></div>');
    dia.html(
        `
        <input type="text" id="cm_uid" placeholder="name" /input>
        <input type="text" id="cm_email" placeholder="email" /input>
        <input type="text" id="cm_dcr" placeholder="describtion" /input>
        <button id="cmsub">submit</button>
        `
    );
    dia.css({"border-width":"5px","border-style":"solid","padding":"8px","margin":"8px"});
    //console.log(jQuery(curbtn).parent().attr("name"));
    jQuery('#cretdiv_'+jQuery(curbtn).parent().attr("name")).append(dia);
}

jQuery(document).on('click','#cmsub',function(){
    var commentlist=JSON.parse(localStorage.getItem("comments") || "[]");
    var newcom={};
    console.log(this);
    if(jQuery('#cm_uid').val()!=undefined&&jQuery('#cm_email').val()!=undefined){
        newcom['postId']=parseInt(jQuery(this).parent().parent().parent().attr('name'));  
        //console.log(jQuery(this).parent().parent());
        newcom['id']=commentlist.length*2+1;
        newcom['name']=jQuery('#cm_uid').val();
        newcom['email']=jQuery('#cm_email').val();
        newcom['body']=jQuery('#cm_dcr').val();
        commentlist.push(newcom);



        var cdiv=jQuery('<div></div>');
        cdiv.attr("id",'comid_'+newcom.id);
        cdiv.attr('name',newcom.id);
        cdiv.css({"border-width":"3px","border-style":"solid","background":"lightgray"});
        cdiv.append('<p>'+'comment name: '+newcom.name+'</p>');
        cdiv.append('<p>'+'email: '+newcom.email+'</p>');
        cdiv.append('<p>'+'Description: '+newcom.body+'</p>');
        if(newcom.like){
            cdiv.append(jQuery('<button disabled>like</button>'));
        }else
        cdiv.append(jQuery('<button>like</button>').click(function(){
            
            // console.log(jQuery(this).parent().attr("name"));
            // console.log(jQuery('#comid_1'));
            for(var j in commentlist){
                if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                    console.log("yes");
                    commentlist[j]['like']=true;

                    console.log(commentlist[j]);
                    localStorage.comments=JSON.stringify(commentlist);
                    break;
                }
            }
            jQuery(this).prop( "disabled", true );
        }));
        cdiv.append(jQuery('<button>delete</button>').click(function(){
            
            // console.log(jQuery(this).parent().attr("name"));
            // console.log(jQuery('#comid_1'));
            for(var j in commentlist){
                if(commentlist[j].id===parseInt(jQuery(this).parent().attr("name"))){
                    console.log("yes");
                    commentlist.splice(j, 1);
                    localStorage.comments=JSON.stringify(commentlist);
                    break;
                }
            }
            jQuery(this).parent().remove('div');
        }));

        jQuery(this).parent().after(cdiv);
        localStorage.comments=JSON.stringify(commentlist);
        console.log("succeed");
        console.log(newcom);
    }else{
        alert("Can not be empty");
    }
})