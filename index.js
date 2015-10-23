define(function(require){
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	//var ip = "http://qixusoft.vicp.net";
	var ip="http://192.168.1.20:8080/OrderSystemWeX5/";
	//var url="UI2/orderSystem_a/index.w#!index";
	var Baas = require("$UI/demo/baas/baas");
	var Model = function(){
		this.callParent();
	};


	//订单详情页
	Model.prototype.button9Click = function(event){
		var currentDeskData = this.comp('currentDeskData');
		var orderData = this.comp('orderData');
		var success = function(param){
			orderData.clear();
			for(var o in param.consumeDetails){
				orderData.newData({
					defaultValues:[{
						goodsName:param.consumeDetails[o].goodsName,
						price:param.consumeDetails[o].price,
						addMoney:param.consumeDetails[o].addMoney,
						qty:param.consumeDetails[o].qty
					}]
				});
			}
		}
		Baas.sendRequest({
			"url" : ip + 'ShopCartServlet.do?func=showOrderedReturnJson&billMasterId='+currentDeskData.val('billMasterId')+'&roomId='+currentDeskData.val('roomId'),
			"dataType": "json",
			"success" : success
		});
		this.comp("order").show();
	};


	//修改菜单
	Model.prototype.div74Click = function(event){
		
		//获取当前行数据
		var row = event.bindingContext.$rawData;
		 
		var currentGoodsData = this.comp('currentGoodsData');
		currentGoodsData.newData({
			index:0,
			defaultValues:[{
				"goodsName":row.val('goodsName'),
				"sprice":row.val('sprice'),
				"qty":row.val('qty'),
				"goodsId":row.val('goodsId'),
				"addMoney":row.val('addMoney')
			}]
		});
		
		var sendCookWayData = this.comp('sendCookWayData');
		//清空加收文本框显示
		$('#showCookWays').text('');
		//清空购物车加钱文本
		var cart = this.comp('cartData');
		cart.eachAll(function(param){
		 
			if(param.row.val('goodsId') == currentGoodsData.val('goodsId')){
				param.row.val('cookWay','');
			}
		})
		//清空当前加收钱项目
		var currentCookWayData = this.comp('currentCookWayData');
		currentCookWayData.clear();

		this.comp("popOver2").show();
	};


	//显示加减购物车数量
	Model.prototype.button12Click = function(event){
		var html="<div class='select-con-wrap' style='text-align:center;'><h5><a href='javascript:;' class='subtract' id='popOver2Sub'></a><span>1</span><a href='javascript:;' class='add' id='popOver2Add'></a></h5></div>";
		$(".select-con").html(html);
	};


	Model.prototype.button13Click = function(event){
		var html="<div class='select-con-wrap'></div>";
		$(".select-con").html(html);
	};


	Model.prototype.button15Click = function(event){
		var html="<textarea class='select-con-wrap' placeholder='请输入要求'></textarea>";
		$(".select-con").html(html);
	};





	//删除选中的口味
	Model.prototype.button11Click = function(event){
		var deletingCookWayData = this.comp('deletingCookWayData');
		var currentCookWayData = this.comp('currentCookWayData');
		currentCookWayData.eachAll(function(param){
			if(param.row.val('goodsId')==deletingCookWayData.val('goodsId')&&param.row.val('cookWayId')==deletingCookWayData.val('cookWayId')){
				currentCookWayData.deleteData(param.row);
				return;
			}
		});
		
	};





	//清空口味
	Model.prototype.button10Click = function(event){
		var currentCookWayData = this.comp('currentCookWayData');
		currentCookWayData.clear();
	};




	//用户登录 ,并记录下当前的userId
	Model.prototype.login_btnClick = function(event){
		var userData = this.comp('userData');
		var contents1 = this.comp('contents1');
		var username=this.comp('userName').val();
		var pwd=this.comp('userPwd').val();
		var mydata = this.comp('user_inof');
		var success = function(data){
			     if(data.admin[0].userId != "")   {
			    	 userData.newData({
			    		 defaultValues:[{
			    		 userId : data.admin[0].userId
			    		 }]
			    	 });
			    	 contents1.to('index');
			     }else{
			    	 justep.Util.hint("登陆失败");
			     }                                            
		}
		Baas.sendRequest({
			"url" : ip + 'LoginByBackstageServlet.do?func=login&returnJson=1',
			"dataType": "json",
			"params":{"username":username,"password":pwd},
			"async" : true,
			"success" : success
		});
				
	};




	//加载台类型 加载数据,通过与链接拿到台类型，与用户id没关
	Model.prototype.fan_nameCustomRefresh = function(event){
		var masterData = event.source;
		var mydata = this.comp('menuTypeData');
		var url= ip+"RoomServlet.do?func=getRoomType&getJson=1";//http://192.168.1.20:8080
	    $.ajax({
	        type: "GET",
	        url: url,
	        dataType: 'json',
	        async: false,//使用同步方式，目前data组件有同步依赖
	        cache: false,
	        success: function(data){
	           // masterData.loadData(data);//将返回的数据加载到data组件
	            var rowss=[];
				for(var i=0;i<data.typeCodes.length;i++){
				 rowss[i]={'typeName':{'value':data.typeCodes[i].typeName},'typeCode':{'value':data.typeCodes[i].typeCode}};
			 	}
			 	var ffdata={"@type":"table","rows":rowss};
			 	//alert(ffdata)
		 	masterData.loadData(ffdata);//将返回的数据加载到data组件
		 	
	        },
	        error: function(){
	          throw justep.Error.create("加载数据失败");
	        }

	    });
	    
	    //加载菜单类型列表，以便让进房间的时候，可以快速看到菜单
	    var url=ip+"GoodsTypeServlet.do?func=listGoodsType&getJson=1";
	    $.ajax({
			type: "GET",
	        url: url,
	        //data:data,
	        dataType: 'json',
	        async: false,//使用同步方式，目前data组件有同步依赖
	        cache: false,
	        success: function(msg){        	
		            var rowss=[];		            
					for(var i=0;i<msg.typeCodes.length;i++){												 
					 rowss[i]={'typeCode':{'value':msg.typeCodes[i].typeCode},'typeName':{'value':msg.typeCodes[i].typeName},'qty':{'value':0}};
				 	}
				 	var ffdata={"rows":rowss};
			
			 	mydata.loadData(ffdata);
		        
	        },
	        error: function(){
	          throw justep.Error.create("加载数据失败");
	        }
		});
	    
	    
	};



	
	//data加载完成，调整顶部宽度
	Model.prototype.modelLoad = function(event){
			//设置菜单宽度
			var liWidth=parseInt($(".menu-con").find('li').outerWidth(true));
			var liMargin=$(".menu-con")
			var liLength=$(".menu-con").find('li').length;
			//alert(liLength)
			$('.menu-con').find("ul").css({"width":liWidth*liLength});
			//alert("k")
			//top-menu-li  加active类
			(function(){
				$(".top-menu-li").click(function(){
				//alert($(this).index())
				$(this).addClass("active").siblings().removeClass("active");
				})
			})();
			$(".top-menu-li").eq(0).trigger("click");
			var row = this.comp('deskData');
			console.log(row)	
	};

	//mydata为deskData
	function getDesk(mydata,row,type){
			var typeCode ;
		if(type == 1){
			typeCode = row.val("typeCode");
		}else{
			typeCode = row;
		}
		var url= ip+"RoomServlet.do";
		var data="func=getRoom&typeCode="+typeCode+"&getJson=1";
		$.ajax({
			type: "GET",
	        url: url,
	        data:data,
	        dataType: 'json',
	        async: false,//使用同步方式，目前data组件有同步依赖
	        cache: false,
	        success: function(msg){	          
	            var rowss=[];
				for(var i=0;i<msg.rooms.length;i++){
					var state="空台";
					var color="black";
					if(msg.rooms[i].state=="3"){
						state="在用";
						color="blue";
					}else if(msg.rooms[i].state=="4"){
						state="埋单";
						color="gray";
					}else if(msg.rooms[i].state=="2"){
						state="预定";
						color="yellow";
					}else if(msg.rooms[i].state=="0"){
						state="禁用";
						color="red";
					}else{
						state="空台";
						color="green";
					}				
				 rowss[i]={'tai_number':{'value':msg.rooms[i].roomName},'state':{'value':state},'roomId':{'value':msg.rooms[i].roomId},'billMasterId':{'value':msg.rooms[i].consumeBillMasterID},
				 'color':{'value':color},'typeCode':{'value':msg.rooms[i].typeCode},'custQty':{'value':msg.rooms[i].custQty},'consumeRoomId':{'value':msg.rooms[i].consumeRoomId}};
			 	}
			 	
			var ffdata={"rows":rowss};
		 	mydata.loadData(ffdata);	
	        },
	        error: function(){
	          throw justep.Error.create("加载数据失败");
	        }
		});
	}


	//点击通过台类型加载桌子，通过状态字段来设置当前的颜色字段
	Model.prototype.li10Click = function(event){
		getDesk(this.comp('deskData'),event.bindingContext.$rawData,1);
	};

	//进入房台，记录下当前的订单号和roomId,然后再根据状态跳去不同的页面
	//1.在这里应该先清空购物车
	//2.重新加载菜单类型信息
	//3.通过购物车重新菜单数量和
	Model.prototype.li1Click = function(event){
		 event.preventDefault(); 
		 //event.stopPropagation();
		var oneDeskData = this.comp('currentDeskData');
		var row = event.bindingContext.$rawData;
		var deskData = this.comp('deskData');
		var state=row.val("state");
		var contents1 = this.comp('contents1');
		var popOver_renshu = this.comp("popOver_renshu");
		var cartData = this.comp('cartData');
		var goodsListData = this.comp('goodsListData');
		var menuTypeData = this.comp('menuTypeData');
		//下面用于刷新当前房台状态
		var deskData = this.comp('deskData');
		
		var success = function(param){
			debugger
			//重新加载房台
			$('#more').slideUp();
			//清空购物车
			cartData.clear();
			//重新加载菜单类型信息
			$.ajax({
		        type: "GET",
		        url: ip + 'GoodsTypeServlet.do?func=listGoodsType&getJson=1',
		        dataType: 'json',
		        async: false,//使用同步方式，目前data组件有同步依赖
		        cache: false,
		        success: function(data){
		            var rowss=[];
					for(var i=0;i<data.typeCodes.length;i++){
					 rowss[i]={'typeName':{'value':data.typeCodes[i].typeName},'typeCode':{'value':data.typeCodes[i].typeCode},'qty':{'value':0}};
				 	}
				 	var ffdata={"@type":"table","rows":rowss};
				 	menuTypeData.loadData(ffdata);//将返回的数据加载到data组件
			 	
		        },
		        error: function(){
		          throw justep.Error.create("加载数据失败");
		        }
			});
			//---------end of ajax-------------
			
			//从localStorage中获取购物车数据
			 ;
			if(localStorage.getItem(param.rooms[0].roomId)!=null&&localStorage.getItem(param.rooms[0].roomId)!=""){
				cartData.loadData(JSON.parse(localStorage.getItem(param.rooms[0].roomId)));
			}
			//通过购物车计算，各商品类型中的数量和商品的数据
			menuTypeData.eachAll(function(data){
				cartData.eachAll(function(data1){
					if(data.row.val('typeCode')==data1.row.val('typeCode')){
						data.row.val('qty',data.row.val('qty')+data1.row.val('qty'));
					}
				});
			});
			//清空商品列表
			goodsListData.clear();			
			//记录当前台号
			oneDeskData.newData({
				index: 0,
				defaultValues:[{
					 "billMasterId":param.rooms[0].consumeBillMasterID,
					 "roomId":param.rooms[0].roomId,
					 "typeCode":param.rooms[0].typeCode,
					 "state":param.rooms[0].state,
					 "custQty":param.rooms[0].custQty,
					 "consumeRoomId":param.rooms[0].consumeRoomId
				}]
			});//end
			if(state=="在用"){
				contents1.to("menu"); 
			}else if(state=="埋单"){
				contents1.to("menu");
			}else if(state="空台"){
				popOver_renshu.show();
				//让文本框架
				$('#custNum').focus();
			}	
		}
		
		var room = '' ;
		var room1 = '';
		if( row.val('consumeRoomId')==null&&row.val('consumeRoomId')==undefined){
			 room = row.val('roomId');			
		}else{
			 room1 = row.val('consumeRoomId');
		}
		debugger
		Baas.sendRequest({		
			"url" : ip + 'RoomServlet.do?func=getRoomById&getJson=1&consumeRoomId='+room1+'&roomId='+room,
			"dataType": "json",
			"success" : success
		});
		
	}



	//菜单点击列表点击
	Model.prototype.li2Click = function(event){
		$(event.target.parentElement).find("li").removeClass("active");
		$(event.target).is("li")?$(event.target).addClass("active").siblings().removeClass("active"):$(event.target.parentElement).addClass("active").siblings().removeClass("active");
		var row = event.bindingContext.$rawData;
		var typeCode=row.val("typeCode");
		var goodsListData = this.comp('goodsListData');
		//从购物车中统计当前各商品购买数量，并将数量显示在商品列中
		var cartData = this.comp('cartData');
		var url= ip+'GoodsServlet.do?func=listByTypeCode&typeCode='+typeCode+'&getJson=1';//http://192.168.1.20:8080
		var success = function(msg){
						var rowss=[];
						for(var i=0;i<msg.goods.length;i++){
						 rowss[i]={'goodsId':{'value':msg.goods[i].goodsId},'goodsName':{'value':msg.goods[i].goodsName},'sprice':{'value':msg.goods[i].sprice},'qty':{'value':0},'typeCode':{'value':msg.goods[i].typeCode},'unitId':{'value':msg.goods[i].unitId}};
					 	}
					 	var ffdata={"rows":rowss};
					 	goodsListData.loadData(ffdata);
				//从购物车中统计当前各商品购买数量，并将数量显示在商品列中
				goodsListData.eachAll(function(param){
						cartData.eachAll(function(data){
							if(param.row.val('goodsId')==data.row.val('goodsId')){
								param.row.val('qty',param.row.val('qty')+data.row.val('qty'));
							}
						});
				}); 	
					 	
					 		 	
	    }
	   
		Baas.sendRequest({
			"url" : url,
			"dataType": "json",
			"success" : success
		});
		
	};


	//取消输入人数弹框
	Model.prototype.button17Click = function(event){
		this.comp("popOver_renshu").hide();
	};



	//空房台的时候，确定人数，然后补上billMasterId,因为进入空房时获取不了billMasterId
	Model.prototype.button16Click = function(event){
	    var contents1 = this.comp('contents1');
	    var currentDeskData =  this.comp('currentDeskData');
	    var pop = this.comp('popOver_renshu');
	    var num = $('#custNum').val();
	    if(num == ''||num == undefined){
	    	alert('输入错误');
	    	return;
	    }
	    var deskData = this.comp('deskData');
	    var row = currentDeskData.val('typeCode');
	    var success = function(param){
	    	 getDesk(deskData,row,2);
	    	//补上当前台的订单id
	    	currentDeskData.newData({
	    		index:0,
	    		defaultValues:[{
	    			 "billMasterId":param.result[0].billMasterId,
	    			 "consumeRoomId":param.result[0].consumeRoomId,
					 "roomId":currentDeskData.val('roomId'),
					 "state":currentDeskData.val('state'),
					 "typeCode":currentDeskData.val('typeCode')
	    		}]
	    	});
	    	pop.hide();
	    	contents1.to('menu');
	    }				
		Baas.sendRequest({
			"url" : ip + 'OrderedNumServlet.do?func=newConsumeRoom&getJson=1&roomId='+currentDeskData.val('roomId')+'&custQty='+num,
			"dataType": "json",
			"success" : success
		});
	};

	//图片路径转换
	Model.prototype.getImageUrl = function(url){
		return require.toUrl(url);
	};

	//菜单购物车加
	Model.prototype.image2Click = function(event){
		var cartData = this.comp('cartData');
		var row = event.bindingContext.$rawData;
		// ;
		var flag = false;//该菜单是否存在
		cartData.eachAll(function(param){
		// ;
			if(param.row.val('goodsId') == row.val('goodsId')){//已经存在
				param.row.val('qty',param.row.val('qty')+1);
				flag = true;
			}
		});
		
		if(flag == false){
			cartData.newData({
				defaultValues:[{
					'goodsId':row.val('goodsId'),
					'qty':row.val('qty')+1,
					'goodsName':row.val('goodsName'),
					'sprice':row.val('sprice'),
					'addMoney':0,
					'typeCode':row.val('typeCode'),
					'unitId':row.val('unitId')
				}]
			});
		}
		//购物车显示数量显示在goodsList
		row.val('qty',row.val('qty')+1);
		//向菜单类型右侧添加数量
		//---1.抽出与当前相同菜单类型的菜单类型
		var menuType = this.comp('menuTypeData');
		menuType.eachAll(function(data){
			if(data.row.val('typeCode') == row.val('typeCode')){
				data.row.val('qty',data.row.val('qty')+1);
			}
		});
		//---end of 加数量
		
		//将购物车数据写入到localStorage
		var currentDeskData = this.comp('currentDeskData');
		var roomId = currentDeskData.val('roomId');
		localStorage.setItem(roomId,JSON.stringify(cartData.toJson()));
	};



	//菜单购物车减,当购物车数量为0的时候，删掉当前行购物车
	Model.prototype.image1Click = function(event){
		var cartData = this.comp('cartData');
		var row = event.bindingContext.$rawData;
		var menuType = this.comp('menuTypeData');
		
		if(row.val('qty')<=1){		
			cartData.eachAll(function(param){
				if(param.row.val('goodsId') == row.val('goodsId')){//已经存在
					cartData.deleteData(param.row);
					row.val('qty',row.val('qty')-1);//将显示数量置0
							//向菜单类型右侧添减数量
							//---1.抽出与当前相同菜单类型的菜单类型
							
							menuType.eachAll(function(data){
								if(data.row.val('typeCode') == row.val('typeCode')){
									data.row.val('qty',data.row.val('qty')-1);
								}
							});
							//---end of 减数量
				}
			});
			return;
		}
		
		cartData.eachAll(function(param){
			if(param.row.val('goodsId') == row.val('goodsId')){//已经存在
				param.row.val('qty',param.row.val('qty')-1);
			}
		});
		
		//购物车显示数量显示在goodsList
		row.val('qty',row.val('qty')-1);
		
		//向菜单类型右侧添减数量
		//---1.抽出与当前相同菜单类型的菜单类型
		
		menuType.eachAll(function(data){
			if(data.row.val('typeCode') == row.val('typeCode')){
				data.row.val('qty',data.row.val('qty')-1);
			}
		});
		//---end of 减数量
		//将购物车数据写入到localStorage
		var currentDeskData = this.comp('currentDeskData');
		var roomId = currentDeskData.val('roomId');
		localStorage.setItem(roomId,JSON.stringify(cartData.toJson()));
	};



	//当打开菜单页面的时候，默认点击第一列
	Model.prototype.menuActive = function(event){
		$('.left-menu').find('li').eq(0).trigger('click');
	};

	//隐藏订单 
	Model.prototype.button6Click = function(event){
		this.comp("order").hide();
	};


	//删除购物车一行
	Model.prototype.p120Click = function(event){
		var row = event.bindingContext.$rawData;
		var goodsId = row.val('goodsId');
		var goodsList = this.comp('goodsListData');
		var currentDeskData = this.comp('currentDeskData');
		var roomId = currentDeskData.val('roomId');
		var typeCode = row.val('typeCode');
		var menuTypeData = this.comp('menuTypeData');

		
		var cartData = this.comp('cartData');
		if(confirm('确定删除<'+row.val('goodsName')+'>')){
			cartData.deleteData(row);
			localStorage.setItem(roomId,JSON.stringify(cartData.toJson()));
			goodsList.eachAll(function(data){//菜单数量置0
				if(data.row.val('goodsId') == goodsId){
					data.row.val('qty',0);
				}
			});
			//菜单类型数量减
			menuTypeData.eachAll(function(param){
				if(param.row.val('typeCode')==typeCode){
					param.row.val('qty',param.row.val('qty')-row.val('qty'));
				}
			});
		}
	};


	//取消编辑菜单
	Model.prototype.button7Click = function(event){
		var currentCookWayData = this.comp('currentCookWayData');
		currentCookWayData.clear();
		var deletingCookWayData = this.comp('deletingCookWayData');
		deletingCookWayData.clear();
		//清空待
		this.comp("popOver2").hide();
	};

	//确定完成编辑菜单，
	Model.prototype.button8Click = function(event){
		//清空待删除口味
		var deletingCookWayData = this.comp('deletingCookWayData');
		deletingCookWayData.clear();
		//购物车加上加工
		var cart = this.comp('cartData');
		var currentCookWayData = this.comp('currentCookWayData');
		var currentGoodsData = this.comp('currentGoodsData');
		var sendCookWayData = this.comp('sendCookWayData');
		//为cart补上cookWay字段，主要用于菜单页面显示,加上附加费用
		cart.eachAll(function(param){
			currentCookWayData.eachAll(function(data){
				if(param.row.val('goodsId')== data.row.val('goodsId')){
						param.row.val('cookWay',param.row.val('cookWay')+data.row.val('cookWay')+'('+data.row.val('addMoney')+')');
				}
			});
			if(param.row.val('goodsId') ==  currentGoodsData.val('goodsId')){
				param.row.val('addMoney',currentGoodsData.val('addMoney'));
			}
		})
		//将currentCookWayData数据加入sendCookWayData，用于发送订单的数据
		currentCookWayData.eachAll(function(param){
			sendCookWayData.newData({
				defaultValues:[{
					'goodsId':param.row.val('goodsId'),
					'cookWayId':param.row.val('cookWayId')
				}]
			});
		});
		
		//清空当前加收
		currentCookWayData.clear();
		this.comp("popOver2").hide();
	};



	//+购物车详情
	Model.prototype.a1Click = function(event){
		var currentGoodsData = this.comp('currentGoodsData');
		var cartData = this.comp('cartData');
		// ;
		cartData.eachAll(function(param){
			if(currentGoodsData.val('goodsId') == param.row.val('goodsId')){
				param.row.val('qty',param.row.val('qty')+1);
			}
		});
		currentGoodsData.newData({
			index:0,
			defaultValues:[{
				"goodsName":currentGoodsData.val('goodsName'),
				"sprice":currentGoodsData.val('sprice'),
				"qty":currentGoodsData.val('qty')+1,
				"goodsId":currentGoodsData.val('goodsId'),
				"addMoney":currentGoodsData.val('addMoney')
			}]
		});
	};

	//-
	Model.prototype.a2Click = function(event){
		var currentGoodsData = this.comp('currentGoodsData');
		var cartData = this.comp('cartData');
		if(currentGoodsData.val('qty')<=1){
			return;
		}
		cartData.eachAll(function(param){
			// ;
			if(currentGoodsData.val('goodsId') == param.row.val('goodsId')){
				param.row.val('qty',param.row.val('qty')-1);
			}
		});
		currentGoodsData.newData({
			index:0,
			defaultValues:[{
				"goodsName":currentGoodsData.val('goodsName'),
				"sprice":currentGoodsData.val('sprice'),
				"qty":currentGoodsData.val('qty')-1,
				"goodsId":currentGoodsData.val('goodsId'),
				"addMoney":currentGoodsData.val('addMoney')
			}]
		});
	};





	//要求分类
	Model.prototype.button14Click = function(event){
		var cookTypeData = this.comp('cookTypeData');
		// ;
		cookTypeData.clear();//清空要求数据
		var success = function(param){
			for(var o in param.typeCodes){
				var typeCode = param.typeCodes[o].typeCode;
				var typeName = param.typeCodes[o].typeName;
				cookTypeData.newData({
					defaultValues:[{
						'typeCode':typeCode,
						'typeName':typeName
					}]
				});
			}
		}
		Baas.sendRequest({
			"url" : ip + 'CookWayServlet.do?func=getCookType&getJson=1',
			"dataType": "json",
			"success" : success
		});
		/*
		//设置要求内标题ul的宽
		var liWidthAll=0; 
		$(".require-title").find("ul").children("li").each(function(){
			liWidthAll+=parseInt($(this).outerWidth(true));
		})
		$(".require-title").find("ul").css({"width":liWidthAll});
		 */
	};


	//要求行事件
	Model.prototype.li4Click = function(event){
			var cookTypeDetailData = this.comp('cookTypeDetailData');
			var row = event.bindingContext.$rawData;
			var success = function(param){
			// ;
				cookTypeDetailData.clear();
				for(var o in param.cookways){
					cookTypeDetailData.newData({
						defaultValues:[{
							'cookWayId':param.cookways[o].cookWayId,
							'typeCode':param.cookways[o].typeCode,
							'cookWay':param.cookways[o].cookWay,
							'addMoney':param.cookways[o].addMoney
						}]
					});
				}
			}
			Baas.sendRequest({
			"url" : ip + 'CookWayServlet.do?func=getCookWay&getJson=1&typeCode='+row.val('typeCode'),
			"dataType": "json",
			"success" : success
		});
	};

	//加收一项
	Model.prototype.li5Click = function(event){
		var row = event.bindingContext.$rawData;
		var currentCookWayData = this.comp('currentCookWayData');
		var currentGoodsData = this.comp('currentGoodsData');
		var flag = false;
		currentCookWayData.eachAll(function(param){
			if(param.row.val('cookWayId') == row.val('cookWayId')){
				justep.Util.hint('已经添加');
				flag = true;
			}
		});
		if(flag == true){
			return;
		}
//		$('#showCookWays').append("<span"+" id='"+row.val('cookWayId')+"'>"+row.val('cookWay')+'('+row.val('addMoney')+')'+"</span>");
		
		currentCookWayData.newData({
			defaultValues:[{
				'cookWayId':row.val('cookWayId'),
				'goodsId':currentGoodsData.val('goodsId'),
				'cookWay':row.val('cookWay'),
				'addMoney':row.val('addMoney'),
				'detail':$('#showCookWays').text()
			}]
		});	
		 ;
		
	};





	//送单
	Model.prototype.button5Click = function(event){
		var currentDeskData = this.comp('currentDeskData');
		var billMasterId = currentDeskData.val('billMasterId');
		var roomId = currentDeskData.val('roomId');
		var orderData = this.comp('orderData');
		var goods = '';
		var cartData = this.comp('cartData');
		cartData.eachAll(function(param){
			goods += param.row.val('goodsId')+'_'+param.row.val('qty')+'_'+param.row.val('sprice')+'_'+param.row.val('goodsName')+'_'+param.row.val('unitId')+',';
		});
		goods = goods.substring(0,goods.length-1);
		var sendCook = this.comp('sendCookWayData');
		var cookways = '';
		sendCook.eachAll(function(param){
				cookways += param.row.val('goodsId')+'_'+param.row.val('cookWayId')+',';
		});
		cookways = cookways.substring(0,cookways.length-1);
		var user = this.comp('userData');
		var url = 'ShopCartServlet.do?func=orderByReturnJson&billMasterId='+billMasterId+'&roomId='+roomId+'&goods='+goods+'&cookways='+cookways+'&orderempcode='+user.val('userId')+'&presents=';	
		var menuTypeData = this.comp('menuTypeData');//用于清0数据
		var goodsListData = this.comp('goodsListData');
		 ;
		//送单成功
		var success = function(param){	
			alert(param.result[0].msg);
			localStorage.setItem(roomId,'');//清空购物车缓存
			cartData.clear();//发送订单成功，清空cartData
			//menuList清0
			menuTypeData.eachAll(function(menuData){
				menuData.row.val('qty',0);
			});
			goodsListData.eachAll(function(goodsData){
				goodsData.row.val('qty',0);
			});
			//
			var testPrintSuccess = function(printData){
			alert(printData)
			//----------------------------------------------------start of print----------------------------------
			sendCook.clear();//清空sendCook
//			alert(param.result[0].msg);
			 
			//当有订单时才打印
			if(param.result[0].billmasterid != ''&&param.result[0].billmasterid != undefined){
				//打印成功
				var success1 = function(param){
					 
					
					
					//更新orderData
							var successOrder = function(param){
									//清空现有的订单数据
									orderData.clear();
									//更新现在的订单列表
									for(var o in param.consumeDetails){
										orderData.newData({
											defaultValues:[{
												goodsName:param.consumeDetails[o].goodsName,
												price:param.consumeDetails[o].price,
												addMoney:param.consumeDetails[o].addMoney,
												qty:param.consumeDetails[o].qty
											}]
										});
									}
									$('.left-menu').find('li').eq(0).trigger('click');//触发菜单界面的点击事件，以便让菜单数量清0
								}
								//拿到订单详情
								Baas.sendRequest({
									"url" : ip + 'ShopCartServlet.do?func=showOrderedReturnJson&billMasterId='+currentDeskData.val('billMasterId')+'&roomId='+currentDeskData.val('roomId'),
									"dataType": "json",
									"success" : successOrder
								});
				}
				//打印
				Baas.sendRequest({
					"url" : ip + 'ShopCartServlet.do?func=afterPrint&isReturnJson=true&billMasterId='+billMasterId+'&roomId='+roomId,
					"dataType": "json",
					"success" : success1
				});
			}
			//----------------------------------------------end of print------------------------------
			}
			//打印前检测端口
			Baas.sendRequest({
					"url" : ip + '/PrintOrder?RptNO=TotalBillLocal&ParamName1=ConsumeRoomID&ParamValue1='+param.result[0].msg.split('=')[1],
					"dataType": "json",
					"success" : testPrintSuccess
			});
		}
			//送单
		Baas.sendRequest({
			"url" : ip + url,
			"dataType": "json",
			"success" : success
		});
	};
	

		
	//删除----选中口味事件
	Model.prototype.li6Click = function(event){
			//去除所有激活点
		$('.ed-con-con').find('li').attr('__inline-id__',$(event.target).attr('__inline-id__')).addClass('active').siblings().removeClass('active');
			//为点击的li加上绿色
		$(event.target.parentElement).addClass('active');
		var deletingCookWayData = this.comp('deletingCookWayData');
		var row = event.bindingContext.$rawData;//currentCookWayData
		
		//将待删除的口味，放入到deletingCookWayData
		deletingCookWayData.newData({
			index:0,
			defaultValues:[{
				'cookWayId':row.val('cookWayId'),
				'goodsId':row.val('goodsId')
			}]
		});
		
		
	};

	Model.prototype.button19Click = function(event){
		this.comp("contents1").to("index");
	
	};
	//搭台
	Model.prototype.button18Click = function(event){
		this.comp("popOver-take").show();
		$('#more').slideUp();

	};

	Model.prototype.button26Click = function(event){
		this.comp("popOver-take").hide();
	};
	
	


	
	//房号加载
	Model.prototype.li1Load = function(event){

	};
	

	
	
	

	//搭台确定
	Model.prototype.button25Click = function(event){
		var currentDeskData = this.comp('currentDeskData');
		var url = 'RoomFunctionServlet.do?func=shareRoom&roomId='+currentDeskData.val('roomId')+'&custQty='+$('#'+this.getIDByXID('input4')).val();
		var contents1 = this.comp('contents1');
		var success = function(param){
			if(param.code == '1'){
				contents1.to('index');
			}
		}
		//送单
		Baas.sendRequest({
			"url" : ip + url,
			"dataType": "json",
			"success" : success
		});
	};
		
	
  //定时器 
    var timeOutEvent=0;
    //长按开始
    Model.prototype.li1Touchstart = function(event){
    	var currentDeskData = this.comp('currentDeskData');
    	var row = event.bindingContext.$rawData;
        timeOutEvent = setTimeout(function(){
        alert('长按开始')
    	timeOutEvent = 0;  
            //执行长按要执行的内容，如弹出菜单         
            //找出台li里的attr=mydata     
            var liObj= $(event.target).is("li") ? $(event.target).attr("mydata") : $(event.target).parents("li").attr("mydata");
            //找出台下主体
            var divObj= $(event.target).is("li") ? $(event.target).find(".table-con") : $(event.target).parents("li").find(".table-con");
            //alert( divObj.html());
            //为选中的台加上active
            divObj.addClass("active").siblings().removeClass("active") //? $(event.target).addClass("active").siblings().removeClass("active") : $(event.target).parents("li").addClass("active").siblings().removeClass("active");
            $(".more-wrap").show();
            $(".main-ul").css({"margin-bottom":"94px"});
            $(".more-wrap").find(".btn").each(function(){
            	$(this).attr({"roomId":liObj});
            });
            //记录下当前长按的桌子信息
            currentDeskData.newData({
				index: 0,
				defaultValues:[{
					 "tai_number":row.val('tai_number'),
					 "billMasterId":row.val('billMasterId'),
					 "roomId":row.val('roomId'),
					 "typeCode":row.val('typeCode'),
					 "state":row.val('state')
				}]
			})
            
        },500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适  
        return false;
    };
    
    //移动
    Model.prototype.li1Touchmove = function(event){
        clearTimeout(timeOutEvent);//清除定时器  
        timeOutEvent = 0;  
    };
    
    //结束
    Model.prototype.li1Touchend = function(event){
           clearTimeout(timeOutEvent);//清除定时器  
            if(timeOutEvent!=0){  
                //这里写要执行的内容（尤如onclick事件）  
              alert("你这是点击，不是长按");  
            }  
          
    };

    //刷新房台
	Model.prototype.indexActive = function(event){
		$('.left-menu').find('li').eq(0).trigger('click');
	};
    
	
	//并台	
	Model.prototype.button20Click = function(event){
		var currentDeskData = this.comp('currentDeskData');
		//当前房间的roomId
		var roomId = currentDeskData.val('roomId');
		var mergeRoomData = this.comp('mergeRoomData');
		//选判断当前节点是否为已点节点
		//1.如果当前节点为空房，则不允许点击
		//2.如果点击的房间为当前房间，则不允许点击 
		
		//当a节点点击的时候，当前节点变红其它节点变灰
		$(".main-ul").find("li").each(function(){
			$(this).unbind("click");
			console.log($(this))
			if($(this).attr("roomid") == roomId){
				$(this).find(".table-con").css({"background":"red"});
				
			}else{
				if($(this).attr("state") == '在用'){
					$(this).find(".table-con").css({"background":"#ccc"});
				}
			}
			$(this).bind("click",function(event){				
				if($(this).attr("state") == '在用'){
					//记录下当前房台的信息
					var currentRoomId = $(this).attr('roomid');
					var creentBillMasterId = $(this).attr('billmasterid');	
					var custQty = $(this).attr('custQty');			
					$(this).find(".table-con").css({"background":"green"})
					var success = function(param){
						
					}
					Baas.sendRequest({
						"url" : ip + 'RoomFunctionServlet.do?func=mergeRoom&shareRoomId=xxxx&shareConsumeRoomId=xxx&shareBillMasterId=xxx&currentRoomId=xxx&currentBillMasterId=xxx&currentConsumeRoomId=xxx&currentCustQty=xxx',
						"dataType": "json",
						"success" : success
					});
				}else{//如果当前房间不为在用状态，不允许并单
					alert('当前桌子不允许并台');
				}
			})
		})
	};

	
	//弹出修改菜名框
	Model.prototype.span32Click = function(event){
		this.comp("give").show();
		this.comp("contents4").to("content17");
	};

	
	//关闭give pop框
	Model.prototype.closeGive = function(event){
		this.comp("give").hide();
	};

	
	
	Model.prototype.span33Click = function(event){
		this.comp("give").show();
		this.comp("contents4").to("content15");
	};

	
	//弹出修改数量框
	Model.prototype.span34Click = function(event){
		this.comp("give").show();
		this.comp("contents4").to("content21");
	};

	
	//弹出赠送框
	Model.prototype.span35Click = function(event){
		this.comp("give").show();
		this.comp("contents4").to("content16");
	};

	
	//转台
	Model.prototype.button21Click = function(event){
		var currentDeskData = this.comp('currentDeskData');
		//当前房间的roomId
		var roomId = currentDeskData.val('roomId');
		//当前房间的名称
		var roomName = currentDeskDate.val("tai_number");
		/*ajax*/
			var url=ip + 'RoomFunctionServlet.do';
			var data='func=changeRoom&changeRoomId='+roomId+'&changeRoomName='+roomName+'&currentRoomId=xxx&currentBillMasterId=xxx&currentConsumeRoomId=xxx&currentShareNo=xxx&currentRoomName=xxx';
			$.ajax({
		        type: "GET",
		        url: url,
		        data:data,
		        dataType: 'json',
		        async: false,//使用同步方式，目前data组件有同步依赖
		        cache: false,
		        success: function(msg){
		        alert(msg)
		        /*
		            var rowss=[];
					for(var i=0;i<msg.typeCodes.length;i++){
					 rowss[i]={'typeName':{'value':msg.typeCodes[i].typeName},'typeCode':{'value':msg.typeCodes[i].typeCode},'qty':{'value':0}};
				 	}
				 	var ffdata={"@type":"table","rows":rowss};
				 	menuTypeData.loadData(ffdata);//将返回的数据加载到data组件
			 	*/
		        },
		        error: function(){
		          throw justep.Error.create("加载数据失败");
		        }
			});
		/*end ajax*/
	};

	
	
	Model.prototype.li1Dblclick = function(event){

	};

	
	
	return Model;
});


