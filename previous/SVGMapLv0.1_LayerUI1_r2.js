// 
// Description:
// SVGMap Standard LayerUI1 for SVGMapLv0.1 >rev12
// Programmed by Satoru Takagi
// 
//  Programmed by Satoru Takagi
//  
//  Copyright (C) 2016-2016 by Satoru Takagi @ KDDI CORPORATION
//  
// License: (GPL v3)
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 3 as
//  published by the Free Software Foundation.
//  
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//  
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
// 
// History:
// 2016/10/11 : LayerUI1 Rev.1 SVGMapLvl0.1_r11�̖{�̂���؂藣����UI��Rev12�p�ɂ��̂܂܈ڐA
// 2016/10/28 : Rev.2 �t���[�����[�N�� svgMapLayerUI
//

( function ( window , undefined ) { 
var document = window.document;
var navigator = window.navigator;
var location = window.location;


var svgMapLayerUI = ( function(){ 



var layerUI; // layer�Z���N�g�p��Select�v�f
var layerUImulti=false; // ��UI��multi���ǂ���
var editLayerTitle = ""; // �ҏW�Ώۂ̃��C���[��title�����i��������


// ���C���[��ID,title,�ԍ��̂����ꂩ�Ń��C���[�̕\����Ԃ��g�O������
// ���̌��ʂ́A���[�g�R���e�iSVG��visibility�ƁA�Ή�����svgImegsProps��editing�t���O�ɔ��f����
// �o�b�`�O���[�v���w�肳���ꍇ������
function toggleLayer( layerID_Numb_Title  ){
	if (! layerID_Numb_Title ){ return };
//	console.log("call toggleLayer:",layerID_Numb_Title);
	var layer = svgMap.getLayer( layerID_Numb_Title );
	if ( layer ){
		var layerId = layer.getAttribute("iid");
		var layersProps = svgMap.getRootLayersProps();
		var lProps = layersProps[layerId];
		if ( typeof poiEdit == "function" && (lProps.editable && lProps.visible ) ){ 
			//�ҏW�\���C���ŕ\����(��\������Ȃ�)
			if ( lProps.editing ){
				//�ҏW���̏ꍇ�́A��ҏW�ɂ��A��\���ɂ���B
				svgMap.setRootLayersProps(layerId, false , false );
			} else {
				//��ҏW���̏ꍇ�́A�\�����̂܂ܕҏW���ɂ���B�����ɑ��̕ҏW�����C�����ҏW�ɂ���B(�����setRootLayersProps���ŃP�A���Ă���)
				svgMap.setRootLayersProps(layerId, true , true );
			}
		} else if ( lProps.visible ){ // �\�����͔�\���ɕύX
			svgMap.setRootLayersProps(layerId, false , false );
		} else { // ��\�����́A�\���ɕύX
			svgMap.setRootLayersProps(layerId, true , false );
		}
	} else { // layer�łȂ��o�b�`�O���[�v�̏ꍇ
//		console.log("this ID might be a batch gruop. :"+ layerID_Numb_Title);
		var bac = layerID_Numb_Title.split(" ");
		var batchLayers = svgMap.getSwLayers( "batch" ); 
		
//		console.log(batchLayers[bac[1]]);
		// �ЂƂł�hidden������ΑS��visible�Ɂ@����Ȃ��Ƃ��͑S��hidden�ɂ���
		var bVisibility = "hidden";
		for ( var i = 0 ; i < batchLayers[bac[1]].length ; i++){
			if ( (batchLayers[bac[1]])[i].getAttribute("visibility" ) == "hidden"){
				bVisibility = "visible";
				break;
			}
		}
		for ( var i = 0 ; i < batchLayers[bac[1]].length ; i++){
			(batchLayers[bac[1]])[i].setAttribute("visibility" , bVisibility);
		}
	}
	svgMap.refreshScreen();
}



var currLayerUIStat= new Array(); // select�v�f�̑S�Ă̑I�����(�o�b�`���C���[�̑I���{�^���܂�)��ۊǂ���z��B�o�b�`�O���[�v�S�I�����(�o�b�`���C���Q���S�I������Ă����΂�����true)

// ���C���[UI(select�v�f)�Ɍ��ݐݒ�l��ݒ肷��
function setLayerUI(target){
	var uap = svgMap.getUaProp();
//	console.log("uaProp:",uap);
	var currentLayersProps = svgMap.getRootLayersProps();
	
//	console.log( currentLayersProps );
	
//	console.log("setLayerUI");
	if (document.getElementById("layer") ){
		layerUI = document.getElementById("layer");
		
		// remove past opts
		for (var i = layerUI.childNodes.length-1; i>=0; i--) {
			layerUI.removeChild(layerUI.childNodes[i]);
		}
		
		if ( layerUI.multiple ){
			layerUImulti = true;
//			console.log("multipleUI");
		}
		
//		var batchLayers = getSwLayers( "batch" ); // �o�b�`�J�e�S���̃��C���[�𓾂�
//		var allLayers = getSwLayers(  );
		
		
		
//		console.log("found Layer:" + layerUI);
//		var layers = getLayers();
//		console.log("layerCount:" + layerUI.length );
		var lcount;
		if ( !layerUImulti ){
			var opt = document.createElement("option");
			opt.innerHTML = "=LAYER=";
			layerUI.appendChild(opt);
			lcount = 1;
		} else {
			lcount = 0;
		}
		var layerGroup = new Array();
		var jqMultiBlankGroup = null; // JQueryUI��multiselect plug�̏ꍇ�Aoptgroup�ɑ����Ȃ����C����blank��optg�Ɋi�[���Č��₷������
		var jqMultiBlankLabel =""; // ���x������������optgroup�ł��Ȃ����E�E
		for ( var i = currentLayersProps.length - 1  ; i >= 0 ; i-- ){
			var sel = false;
			var layerGroupName = currentLayersProps[i].groupName;
			
			if ( layerGroupName ){
				// �o�b�`||�X�C�b�`||���ł��Ȃ� ���C���[ �O���[�v�ɑ����Ă��郌�C���[�̏ꍇ
//				console.log("found batch:",currentLayersProps[i].groupFeature);
//				console.log("name:",layerGroupName);
				if ( !layerGroup[layerGroupName]  ){ // UI�ɂ܂��Y�����C���[�O���[�v���Ȃ��ꍇ
				
					layerGroup[layerGroupName] = new Object();
					layerGroup[layerGroupName].optgroup=document.createElement("optgroup");
					layerGroup[layerGroupName].optgroup.label = layerGroupName;
//					layerGroup[layerGroupName].optgroup.label = "";
					layerUI.appendChild(layerGroup[layerGroupName].optgroup);
					
					if (currentLayersProps[i].groupFeature == "batch"){
						// �o�b�`���C���[�̏ꍇ�̏���
						// �o�b�`���C���[��"�S�I��*"���ڂ��L�ڂ���
						// ���̍��ڂ�value�� batch + �O���[�v���Ƃ���
						var opt = document.createElement("option");
						layerGroup[layerGroupName].optgroup.appendChild(opt);
						opt.value = "batch " +layerGroupName;
//						opt.innerHTML = layerGroupName + "/ *";
						opt.innerHTML = "[ALL]";
	//					layerUI.appendChild(opt);
						
						var blStyle ="color:#2020FF";
						sel = true;
						var batchLayers = svgMap.getSwLayers( "batch" ); 
						for ( var ii = 0 ; ii < batchLayers[layerGroupName].length ; ii++){
							if ( (batchLayers[layerGroupName])[ii].getAttribute("visibility" ) == "hidden"){
								blStyle ="color:#A0A0FF";
								sel = false;
								break;
							}
						}
						if (!uap.isIE || !layerUImulti ){ // IE��multiple�̏ꍇ�Ƃɂ����o�O���Ђǂ�
							opt.setAttribute("style" , blStyle);
						}
						if ( sel ){
							opt.selected = true;
						} else {
							opt.selected = false;
						}
						currLayerUIStat[lcount] = sel;
						++lcount; // �o�b�`����UI������currLayerUIStat�̍��ڂ�������E�E
						sel = false;
					}
				}
				jqMultiBlankGroup = null;
			} else if (typeof  $ != "undefined" && $("#layer").multiselect ){
				// jquery ui multiselect�̏ꍇ�A�O���[�v�̂Ȃ����C���[���O���[�v�̂��郌�C���[�Ƌ�ʂ��Ȃ��Ȃ��肪����̂ŁA�����������邽�߂ɖ����̃O���[�v�ɓ����E�E
				if ( jqMultiBlankGroup == null ){
					jqMultiBlankGroup = document.createElement("optgroup");
					jqMultiBlankGroup.label = jqMultiBlankLabel;
					jqMultiBlankLabel += " "; // �Ƃق� ���S�ɗ��Z����ˁE�E
					layerUI.appendChild( jqMultiBlankGroup );
				}
			}
			
			var optTarget;
			if ( layerGroupName ){
				optTarget = layerGroup[layerGroupName].optgroup;
			} else if ( jqMultiBlankGroup ) {
				optTarget = jqMultiBlankGroup;
			} else {
				optTarget = layerUI;
			}
			
//			var optText = layerGroupName + "/";
			var optText ="";
			optText += currentLayersProps[i].title;
			
			var style = "color:#000000";
			
			if ( ! currentLayersProps[i].visible ){
				style = "color:#c0c0FF";
				if ( uap.isSP ){ // �X�}�z�̈ꕔ�ł�select���ʕ`��ɂȂ�A�X�^�C���������Ȃ��̂ŁE�E
					optText = "X: " + optText;
				}
			} else {
				sel = true;
				style = "color:#000000";
				if ( uap.isSP ){
					optText = "O: " + optText;
				}
			}
			
//			console.log("isEditing?"+currentLayersProps[i].editing);
//			console.log("isEditable?"+currentLayersProps[i].editable);
			if ( typeof poiEdit == "function" ){
				if ( currentLayersProps[i].editing ){
					optText += " - [[EDITING!]]";
				} else if ( currentLayersProps[i].editable ){
					optText += " - editable";
				}
			}
			
			var opt = document.createElement("option");
			optTarget.appendChild(opt);
			opt.innerHTML = optText;
			
			if (!uap.isIE || !layerUImulti ){ // IE��multiple�̏ꍇ�Ƃɂ����o�O���Ђǂ� 2014.09.04
				opt.setAttribute("style" , style);
			}
			opt.value = currentLayersProps[i].id;
			if ( sel ){
				opt.selected = true;
			} else {
				opt.selected = false;
			}
			currLayerUIStat[lcount] = sel;
			++lcount;
			
		}
		if ( !layerUImulti ){
			layerUI.selectedIndex = 0;
		} else {
//			console.log("layerUI.selectedIndex:",layerUI.selectedIndex);
//			layerUI.selectedIndex = -1;
		}
		
		if (typeof  $ != "undefined" && $("#layer").multiselect ){
//		if (typeof jQuery != "undefined" && $("#layer").multiselect ){}
			setTimeout(function(){
				$("#layer").multiselect("refresh");
				if ( $("#layer").multiselect("option").height == "auto" ){
					// window�T�C�Y�ɑ΂��č��ڐ���������auto�̏ꍇ���S�ɂ͂ݏo���̂ł����}�~���鏈�� 2014.11.21
					// window�T�C�Y�̕ύX�ɑ΂��Ēǐ��͂��Ȃ��ȁE�E
					var msd= document.getElementById("layer").nextSibling.getBoundingClientRect();
					
					$("#layer").multiselect({height :  window.innerHeight - (msd.top+100)});
				}
			}, 100);
		}
		
		/**
		if ( uap.isIE ){
//			layerUI.blur(); // IE��multiple�̏ꍇ�v�f��ω�������ƂƂ܂�@�Ȃ񂩂���Œ���炵��?
			// http://www.experts-exchange.com/Software/Internet_Email/Web_Browsers/Q_28136890.html
			// �ŏ��̍��ڂ͒���Ȃ��Ȃ��E�E
		}
		**/
	}
}

//console.log("registLayerUi");
svgMap.registLayerUiSetter( setLayerUI );

function layerControl(){
//	console.log("layerControl idx:"+layerUI.selectedIndex , layerUI.options[layerUI.selectedIndex].getAttribute("value"));
	var changedItem;
	var changedCount;
	if (typeof $ != "undefined" && $("#layer").multiselect ){
		var ckd = $("#layer").multiselect("getChecked");
		for ( var j = 0 ; j < ckd.length ; j++ ){
//			console.log(Number(ckd[j].id.substring(1+ckd[j].id.lastIndexOf("-"))));
		}
		var j = 0;
		changedCount = 0;
		for ( var i = 0 ; i < currLayerUIStat.length ; i++ ){
			var UItrue = false;
			if ( ckd[j] && Number(ckd[j].id.substring(1+ckd[j].id.lastIndexOf("-"))) == i ){
				UItrue = true;
				++j;
			}
			if ( UItrue == currLayerUIStat[i] ){
//				console.log("NoChange:",i);
			} else {
//				console.log("Changed!:",i);
				changedItem = i;
				++changedCount;
			}
		}
//		console.log($("#layer").multiselect("getChecked"), currLayerUIStat);
	} else {
		changedCount = 1;
		changedItem = layerUI.selectedIndex;
	}
//	toggleLayer(layerUI.length - 1  - layerUI.selectedIndex);
	if ( changedCount == 1 ){
		toggleLayer(layerUI.options[changedItem].getAttribute("value"));
	} else {
		console.log("changedCount >1 ...... ");
	}
	setLayerUI();
}

return { // svgMapLayerUI. �Ō��J����֐��̃��X�g
	layerControl : layerControl
}

})();

window.svgMapLayerUI = svgMapLayerUI;


})( window );

