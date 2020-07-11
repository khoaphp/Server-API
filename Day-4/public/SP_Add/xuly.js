$(document).ready(function(){
    //alert(1);
    $("#formLoaiSP").hide();

    $("#btnFrmLoaiSP").click(function(){
        $("#formLoaiSP").slideToggle("slow");
    });

    $("#btnThemLoaiSP").click(function(){
        $.post("http://localhost:3000/Ajax_Add_New_LoaiSP", {TenLoaiSP:$("#txtTenLoaiSP").val()}, function(data){
            if(data.kq==1){
               console.log(data.mangLoaiSP);

               $("#tblLoaiSP").html("");
               data.mangLoaiSP.forEach(loaiSP => {
                   $("#tblLoaiSP").append(`
                        <tr>
                            <td class="rowLoaiSP" idLoai="`+loaiSP._id+`">` + loaiSP.Ten  + `</td>
                            <td></td>
                        </tr>
                   `);
               });

               $("#slcLoai").html("");
               data.mangLoaiSP.forEach(loaiSP => {
                $("#slcLoai").append(`
                    <option value="`+ loaiSP._id +`">`+ loaiSP.Ten +`</option>
                `);
            });

            }else{
                alert("Wrong");
            }
        });
    });

    $(".rowLoaiSP").click(function(){
        //alert($(this).html());
    });

    $("#baoBenNgoai").hide();
    $("#frmSuaTenLoai").hide();
    $("#btnDongFrm").click(function(){
        $("#frmSuaTenLoai").hide(500, function(){
            $("#baoBenNgoai").hide();
        });
    });

    $(document).on( "click", ".rowLoaiSP" , function(){
        var idLoai = $(this).attr("idLoai");
  
        var TenLoai = $(this).html();
        $("#txtSuaTenLoai").val(TenLoai);
        $("#txtSuaTenLoai").attr("idLoai", idLoai);
        $("#baoBenNgoai").show(300);
        $("#frmSuaTenLoai").show(3000);

        //$(this).html(`<input type="text" id="" class="" idLoai="`+idLoai+`" value="`+TenLoai+`" />`);
    });

    $("#btnSuaTenLoai").click(function(){
        var idLoai = $("#txtSuaTenLoai").attr("idLoai");
        var TenLoai = $("#txtSuaTenLoai").val();
    
        $.post("./Ajax_Update_TenLoai", {
            IDLoai:idLoai,
            Ten:TenLoai
        }, function(data){
            if(data.kq==0){
                console.log("Error");
                console.log(data.errMsg);
            }else{
                console.log("UPdate new Okay");
                console.log(data.mangLoaiMoi);
                $("#frmSuaTenLoai").hide(500, function(){
                    $("#baoBenNgoai").hide();
                });

                // Update Select & Div vang
                $("#slcLoai").html("");
                data.mangLoaiMoi.forEach(function(moi){
                    $("#slcLoai").append(`<option value="`+moi._id+`">`+moi.Ten+`</option>`);
                });

                $("#tblLoaiSP").html("");
                data.mangLoaiMoi.forEach(function(moi){
                    $("#tblLoaiSP").append(`
                    <tr>
                        <td class="rowLoaiSP" idLoai="`+moi._id+`">`+moi.Ten+`</td>
                        <td></td>
                    </tr>
                    `);
                });
            }
        });
    });

    $("#fileHinhSP").change(function(){
        // ajax upload
        var data = new FormData();
            
        jQuery.each(jQuery('#fileHinhSP')[0].files, function(i, file) {
                console.log('file-'+i);
                data.append('file-'+i, file);
            });

            jQuery.ajax({
                url: './uploadImage',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
                success: function(data){
                    console.log(data);
                    $("#tenFileHinhDaUpload").val(data.fileHinh.filename);
                    if(data.kq==1){
                        $("#imgDemo").attr("src", "upload/" + data.fileHinh.filename);
                    }else{
                        alert("Upload hinh loi." + data.errMsg);
                    }
                }
            });


    });

});