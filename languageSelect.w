<?xml version="1.0" encoding="UTF-8"?>

<div xmlns="http://www.w3.org/1999/xhtml" xid="window" class="window" component="$UI/system/components/justep/window/window" design="device:m;">  
  <div component="$UI/system/components/justep/model/model" xid="model" style="height:auto;left:692px;top:326px;"><div component="$UI/system/components/justep/data/data" autoLoad="true" xid="language" idColumn="col0" onCustomRefresh="languageCustomRefresh"><column name="col0" type="String" xid="xid1"></column>
  <column name="languageId" type="String" xid="xid2"></column>
  <column name="languageName" type="String" xid="xid3"></column></div></div> 
<div component="$UI/system/components/justep/list/list" class="x-list" xid="list1" data="language">
   <ul class="x-list-template" xid="listTemplateUl1">
    <li xid="li1" bind-text="val('languageName')" bind-click="li1Click"></li></ul> </div><div component="$UI/system/components/justep/panel/panel" class="x-panel x-full" xid="panel1">
   <div class="x-panel-top" xid="top1"><div component="$UI/system/components/justep/titleBar/titleBar" class="x-titlebar" xid="titleBar1" title="welcome">
   <div class="x-titlebar-left" xid="div1"></div>
   <div class="x-titlebar-title" xid="div2">welcome</div>
   <div class="x-titlebar-right reverse" xid="div3"></div></div></div>
   <div class="x-panel-content" xid="content1"><div component="$UI/system/components/justep/labelEdit/labelEdit" class="x-label-edit x-label30" xid="labelSelect1">
   <label class="x-label" xid="label1"><![CDATA[请选择语言]]></label>
   <select component="$UI/system/components/justep/select/select" class="form-control x-edit" xid="select1">
   
   <option></option>
   </select></div>
  <a component="$UI/system/components/justep/button/button" class="btn btn-default" label="button" xid="button1" bind-click="li1Click">
   <i xid="i1"></i>
   <span xid="span1"></span></a>
  <label component="$UI/system/components/justep/pagerLimitSelect/pagerLimitSelect" class="x-pagerlimitselect hasLabel" xid="pagerLimitSelect1">
   <select component="$UI/system/components/justep/select/select" class="form-control input-sm" xid="select2">
    <option value="10" xid="default1">10</option>
    <option value="20" xid="default2">20</option>
    <option value="50" xid="default3">50</option>
    <option value="100" xid="default4">100</option></select> 
   </label></div>
   <div class="x-panel-bottom" xid="bottom1"></div></div></div>