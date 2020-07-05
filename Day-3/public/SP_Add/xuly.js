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
        alert($(this).html());
    });

    $(document).on( "click", ".rowLoaiSP" , function(){
        var idLoai = $(this).attr("idLoai");
        var TenLoai = $(this).html();
        $(this).html(`<input type="text" id="" class="" idLoai="`+idLoai+`" value="`+TenLoai+`" />`);
    });

});