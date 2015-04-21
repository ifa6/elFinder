 /**
     * @class  elFinder command "help"
     * "About" dialog
     *
     * @author Dmitry (dio) Levashov
     **/
    elFinder.prototype.commands.share = function(hashes) {

            function doCopy() {
            var client = new ZeroClipboard(document.getElementById('cplinkurlbt'));

            client.setText( $('#cplinkurl').val());

            client.on( 'ready', function(event) {
                console.log( 'movie is loaded' );

            });
            client.on('aftercopy',function(evt){
                var dialog=$("<div id='dialog-modal' title='Share Notice'><p>Copy Successful</p></div>").dialog({
                    height: 130,
                    width:330,
                    modal: false
                });
                setTimeout(function(){dialog.dialog( "destroy" );},1000);
                return false;
            });
        }

        function cutStr(str, len) {
            //length属性读出来的汉字长度为1
            if(str.length*2 <= len) {
                return str;
            }
            var strlen = 0;
            var s = "";
            for(var i = 0;i < str.length; i++) {
                s = s + str.charAt(i);
                if (str.charCodeAt(i) > 128) {
                    strlen = strlen + 2;
                    if(strlen >= len){
                        return s.substring(0,s.length-1) + "...";
                    }
                } else {
                    strlen = strlen + 1;
                    if(strlen >= len){
                        return s.substring(0,s.length-2) + "...";
                    }
                }
            }
            return s; }

        var fm   = this.fm,
            base   = fm.options.url,
            self = this,
            linktpl = '<div class="elfinder-help-link"> <a href="{url}">{link}</a></div>',
            atpl    = '<div class="elfinder-help-team"><div>{author}</div>{work}</div>',
            url     = /\{url\}/,
            link    = /\{link\}/,
            author  = /\{author\}/,
            work    = /\{work\}/,
            r       = 'replace',
            prim    = 'ui-priority-primary',
            sec     = 'ui-priority-secondary',
            lic     = 'elfinder-help-license',
            tab     = '<li class="ui-state-default ui-corner-top"><a href="#{id}">{title}</a></li>',
            html    = ['<div class="ui-tabs ui-widget ui-widget-content ui-corner-all elfinder-help">',
                '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'],
            stpl    = '<div class="elfinder-help-shortcut"><div class="elfinder-help-shortcut-pattern">{pattern}</div> {descrip}</div>',
            sep     = '<div class="elfinder-help-separator"/>',



           function  copyLink() {
                // help tab
                html.push('<div id="copylink" class="ui-tabs-panel ui-widget-content ui-corner-bottom" style="text-align:center">');
                var createlink='';
                html.push('<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover" role="button" aria-disabled="false" id="sharebutton"><span class="ui-button-text">Create Share Links</span></button><div  id="repdiv" style="display:none" style="position:relative"><div style="margin">Share link:</span><input style="margin:5px 0px;padding:5px;width:100%" type="text" name="cplinkurl" id="cplinkurl"><span id="zcpswf" ><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover" role="button" aria-disabled="false" id="cplinkurlbt"><span class="ui-button-text">Copy Link</span></button></span><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover" role="button" aria-disabled="false" id="nosharebutton"><span class="ui-button-text">Cancel Share</span></button><p>Copy link and send to your friends in Facebook,Twitter ,etc</p></div>');
                html.push('</div>');
                // end help
            },
            content;

        this.alwaysEnabled  = true;
        this.updateOnSelect = false;
        this.state = 0;

        this.shortcuts = [{
            pattern     : 'f1',
            description : this.title
        }];
        //console.log(fm);
        setTimeout(function() {
            var parts = self.options.view || ['copylink']; //'about', 'shortcuts', 'help',

            $.each(parts, function(i, title) {
                //tab[r]=tab.replace
                html.push(tab[r](/\{id\}/, title)[r](/\{title\}/, fm.i18n(title)));
            });

            html.push('</ul>');

//		$.inArray('about', parts) !== -1 && about();
//		$.inArray('shortcuts', parts) !== -1 && shortcuts();
//		$.inArray('help', parts) !== -1 && help();
            $.inArray('copylink', parts) !== -1 && copyLink();


            html.push('</div>');
            content = $(html.join(''));
            //console.log(fm);
            content.find('.ui-tabs-nav li')
                .hover(function() {
                    $(this).toggleClass('ui-state-hover')
                })
                .children()
                .click(function(e) {
                    var link = $(this);

                    e.preventDefault();
                    e.stopPropagation();

                    if (!link.is('.ui-tabs-selected')) {
                        link.parent().addClass('ui-tabs-selected ui-state-active').siblings().removeClass('ui-tabs-selected').removeClass('ui-state-active');
                        content.find('.ui-tabs-panel').hide().filter(link.attr('href')).show();
                    }
                    //增加clipboard
                    if($(this).html()=='copylink')
                    {
                        $("#sharebutton").click(function(){

                            if(typeof files[0]=='undefined')
                            {

                                $("<div id='dialog-modal' title='Share Notice'><p>Please select one file to share,Directory can't be shared.</p></div>").dialog({
                                    height: 140,
                                    width:400,
                                    modal: true
                                });
                                return;
                            }
                            //分享的类型
                            var shtype=files[0].hash.split("_")[0][0]


                            $("#repdiv").show();
                            $(this).hide();
                            $("#copylink").css('text-align','left');
                            base += base.indexOf('?') === -1 ? '?' : '&';
                            var sharelink="http://"+location.hostname+base+'cmd=file&target=' + files[0].hash+'&download=1';

                            $('#cplinkurl').val(sharelink);
                            if(shtype=='m')
                            {
                               // $('#cplinkurl').val(sharelink);
                                //$.get('http://s.88snow.com/index.php?u='+encodeURIComponent(sharelink), function(data) {
                                //    if(data.indexOf('http://')!=-1)
                                //    {
                                //
                                //        var sharelink="http://"+location.hostname+'/'+base+'cmd=file&target=' + files[0].hash+'&download=1';
                                //        $.get(sharelink.replace(/cmd=file/i,'cmd=share'),function(data){});
                                //    }
                                //});
                            }
                            else if(shtype="d")
                            {
                                //分享类型是dropbox
                                //$.getJSON('home.php?mod=space&do=storage&go=conn&cmd=share&target='+files[0].hash+'&init=1&tree=1&_='+(new Date().getTime()),function(data) {
                                //    if(data!=null && data!="")
                                //    {
                                //        $('#cplinkurl').val(data.url);
                                //    }
                                //});
                            }
                            doCopy();
                            //$.get(sharelink.replace(/cmd=file/i,'cmd=share'),function(data){});




                        });
                        $("#nosharebutton").click(function(){

                            $("#repdiv").hide();
                            $("#sharebutton").show();
                            $("#copylink").css('text-align','center');
                            var shtype=files[0].hash.split("_")[0][0]

                            if(shtype=='m')
                            {
                                var sharelink="http://"+location.hostname+'/'+base+'cmd=share&target=' + files[0].hash+'&download=0';
                                $.get(sharelink,function(data){});

                            }


                        });
                    }

                })
                .filter(':first').click();

        }, 400);

        this.getstate = function() {
            return 0;
        }

        this.exec = function(hashes) {
            filter = function(hashes) {
                return $.map(self.files(hashes), function(f) { return f.mime == 'directory' ? null : f });
            },
                files  = filter(hashes);
            if (!this.dialog) {
                this.dialog = this.fm.dialog(content, {title : this.title, width : 530, autoOpen : false, destroyOnClose : false});
            }

            this.dialog.elfinderdialog('open').find('.ui-tabs-nav li a:first').click();
        }




    }