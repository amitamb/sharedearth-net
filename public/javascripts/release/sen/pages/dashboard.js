/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["sen.pages.dashboard"]){dojo._hasResource["sen.pages.dashboard"]=true;dojo.provide("sen.pages.dashboard");dojo.require("dojo.fx");dojo.require("dojo.NodeList-fx");dojo.require("dojo.NodeList-traverse");dojo.require("dojo.NodeList-manipulate");dojo.declare("sen.pages.dashboard",null,{connectedEvents:null,inFlight:null,init:function(){this.connectedEvents={"dashboard":[],"comments":[]};this.inFlight={"dashboard":[],"comments":[]};this.initUi();this.initEvents();},initUi:function(){dojo.query("form.new_comment input#comment_submit").forEach(function(_1){dojo.style(_1,"display","none");});},initEvents:function(){this.connectDashboardEvents();this.connectCommentEvents();},connectDashboardEvents:function(_2){var _3=_2!==undefined?_2+".dashboard-action-link":".dashboard-action-link",_4=this;this.disconnectDashboardEvents(_2);dojo.query(_3).forEach(function(_5){var _6=dojo.connect(_5,"onclick",_4,function(e){_4.doLinkClick(_5,e);});_4.connectedEvents.dashboard.push(_6);});dojo.query("a.action-comments-show-hide").forEach(function(_7){var _8=dojo.connect(_7,"onclick",_4,"toggleActionComments");console.debug("COMMENT",_7);_4.connectedEvents.comments.push(_8);});},disconnectDashboardEvents:function(_9){dojo.forEach(this.connectedEvents.dashboard,dojo.disconnect);this.connectedEvents.dashboard=[];},connectCommentEvents:function(){var _a=this;dojo.query("form.new_comment").forEach(function(_b){var _c=dojo.connect(_b,"onsubmit",_a,"addComment");_a.connectedEvents.comments.push(_c);var _c=dojo.connect(_b,"onkeypress",_a,"addComment");_a.connectedEvents.comments.push(_c);});dojo.query("a.comments-show-hide").forEach(function(_d){var _e=dojo.connect(_d,"onclick",_a,"toggleComments");_a.connectedEvents.comments.push(_e);});dojo.query("form.new_comment textarea").forEach(function(_f){var _10=dojo.connect(_f,"onfocus",_a,"toggleCommentBoxHeight");_a.connectedEvents.comments.push(_10);});dojo.query("form.new_comment textarea").forEach(function(_11){var _12=dojo.connect(_11,"onblur",_a,"toggleCommentBoxHeight");_a.connectedEvents.comments.push(_12);});},disconnectCommentEvents:function(_13){dojo.forEach(this.connectedEvents.comments,dojo.disconnect);this.connectedEvents.comments=[];},toggleCommentBoxHeight:function(e){if(e.type=="blur"){this.commentBlur(e.target);}else{this.commentFocus(e.target);}},commentBlur:function(_14){dojo.animateProperty({node:_14,duration:200,properties:{height:{start:"30",end:"15"}}}).play();if(dojo.attr(_14,"value")==""){dojo.attr(_14,"value","Write a comment...");}dojo.removeClass(_14,"active-comment-box");},commentFocus:function(_15){dojo.animateProperty({node:_15,duration:200,properties:{height:{start:"15",end:"30"}}}).play();if(dojo.attr(_15,"value")=="Write a comment..."){dojo.attr(_15,"value","");}dojo.addClass(_15,"active-comment-box");},toggleComments:function(e){dojo.stopEvent(e);var _16=this,_17=new dojo.NodeList(e.target);_17.parents(".sidebar-box").query("ul.comment-list").forEach(function(_18){dojo.toggleClass(_18,"comment-list-hidden");});},toggleActionComments:function(e){dojo.stopEvent(e);var _19=this,_1a=new dojo.NodeList(e.target);_1a.parents("div.inner-content").query("ul.comment-list").forEach(function(_1b){dojo.toggleClass(_1b,"comment-list-hidden");});},addComment:function(e){if(dojo.getNodeProp(e.target,"tagName").toLowerCase()!=="form"){if(e.keyCode==dojo.keys.ENTER&&e.shiftKey==false){dojo.stopEvent(e);var nl=new dojo.NodeList(e.target),_1c=nl.parents("form").attr("action"),_1d=nl.parents("form");}else{if(e.keyCode==dojo.keys.ESCAPE){dojo.attr(e.target,"value","");e.target.blur();this.commentBlur(e.target);return;}else{return;}}}else{dojo.stopEvent(e);var _1c=dojo.attr(e.target,"action"),_1d=new dojo.NodeList(e.target);}var _1e=this,_1f=_1d.query(".new-comment-commentable-id").first().attr("value"),_20=_1d.query(".new-comment-text").first().attr("value");if(this.inFlight.comments[_1f]!==true&&_20!=""){dojo.style(e.target,"display","none");_1d.before("<div class=\"loader\"></div>");this.inFlight.comments[_1f]=true;dojo.xhrPost({url:_1c,handleAs:"json",content:{"comment[commentable_id]":_1f,"comment[commentable_type]":_1d.query(".new-comment-commentable-type").first().attr("value"),"comment[comment]":_20,"authenticity_token":dojo.global.AUTH_TOKEN,"utf8":"✓"},load:function(_21){if(_21.success&&_21.success==false){}else{var _22=String(_21.comment_html).replace(/\"clearfix\"/,"\"clearfix new-comment\" style=\"opacity:0;\"");_1d.parents(".comment-list").children("li.no-bg").before(_22);_1d.parents(".comment-list").children("li.new-comment").fadeIn({auto:true,duration:800});if(_1d.parents("li.sidebar-box").length>0){var _23=_1d.parents("li.sidebar-box").query("a.comments-show-hide").first();}else{if(_1d.parents("li.content-box").length>0){var _23=_1d.parents("li.content-box").query("a.action-comments-show-hide").first();}}var _24=_23.attr("innerHTML");regExp=/([0-9]+)/g,currentCount=String(_24).match(regExp);var _25=String(_24).replace(regExp,parseInt(currentCount)+1);_23.attr("innerHTML",_25);_1d.query("textarea").attr("value","");dojo.style(e.target,"display",null);_1d.parent().query("div.loader").remove();_1e.inFlight.comments[_1f]=false;}},error:function(err,_26){alert("Oops! Something went wrong.");dojo.style(e.target,"display",null);_1d.parent().query("div.loader").remove();_1e.inFlight.comments[_1f]=false;}});}return;},doLinkClick:function(_27,e){dojo.stopEvent(e);var _28=dojo.attr(e.target,"href"),_29=this,_2a=new dojo.NodeList(e.target),_2b=_2a.parents("li.content-box").children("a").attr("href"),_2c=String(_2b).replace("/requests/","");if(this.inFlight.dashboard[_2c]!==true){var _2d=_2a.parents("div.action ul");_2d.forEach(function(_2e){dojo.style(_2e,"display","none");});_2d.before("<div class=\"loader\"></div>");this.inFlight.dashboard[_2c]=true;dojo.xhrPut({url:_28,handleAs:"json",content:{"authenticity_token":dojo.global.AUTH_TOKEN},load:function(_2f){if(_2f.success&&_2f.success==false){}else{var _30=_2f.activity_html,_31=_2f.request_html;var _32=_2a.parents("li.content-box"),_33=_32.prev(),_34=dojo.query("ul.dashboard-recent-activity").children().first();if(_33.length===0){_33=_32.parent();_32.remove();if(String(_31)!==""){_33.forEach(function(_35){dojo.place(_31,_35,"first");});}if(_33.children("li").length==0){_33.parents("div.content-box-holder").forEach(function(_36){dojo.style(_36,"display","none");});}}else{_32.remove();if(String(_31)!==""){_33.after(_31);}if(_33.parent().children("li").length==0){_33.parents("div.content-box-holder").forEach(function(_37){dojo.style(_37,"display","none");});}}_29.initUi();_34.after(_30);_29.disconnectDashboardEvents();_29.disconnectCommentEvents();_29.connectDashboardEvents();_29.connectCommentEvents();_29.updateMetrics(_2f);_2d.forEach(function(_38){dojo.style(_38,"display",null);});_2d.parent().query("div.loader").remove();_29.inFlight.dashboard[_2c]=false;}},error:function(err,_39){alert("Oops! Something went wrong.");_2d.forEach(function(_3a){dojo.style(_3a,"display",null);});_2d.parent().query("div.loader").remove();_29.inFlight.dashboard[_2c]=false;}});}},updateMetrics:function(_3b){if(_3b.activity_level){var _3c=dojo.query("li.activity-level a");_3c.attr("innerHTML",_3b.activity_level);}if(_3b.gift_actions){var _3d=dojo.query("li.giftactions a");_3d.attr("innerHTML",_3b.gift_actions);}if(_3b.people_helped){var _3e=dojo.query("li.people-helped a");_3e.attr("innerHTML",_3b.people_helped);}},unload:function(){this.disconnectDashboardEvents();this.disconnectCommentEvents();}});}