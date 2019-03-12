<%--
  Created by IntelliJ IDEA.
  User: liangyh
  Date: 7/26/16
  Time: 6:03 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!-- 修改逻辑 -->
<div id="rule_modify">
	<div class="modify_yy"></div>
	<div class="modify_content">
		<div class="modify_head">
			<p id="title_p">修改供应商手续费信息</p>
			<span class="modify_cancel" onclick="hideSupplierFeeModal()">X</span>
			<div class="clear"></div>
		</div>
		<form id="supplierFeeFormID">
			<ul class="modify_ul">
				<input name="whiteListId" type="hidden" id="supplierFeeID"/>
				<li><label>供应商 <font color="red"> * </font> : </label><input name="supplier" type="text" id="supplierID"/></li>
				<li><label>币种 <font color="red"> * </font> : </label><input name="currency" type="text" id="currencyID" value="" disabled/><span id="supplier_currency">同步币种</span></li>
				<li><label>退票手续费  : </label><input name="refundFee" type="text" id="refundFeeID"/></li>
				<li><label>改签手续费  : </label><input name="changeFee" type="text" id="changeFeeID"/></li>
				<li><label>签转手续费  : </label><input name="signFee" type="text" id="signFeeID"/></li>
				<li><label>误机手续费  : </label><input name="missFee" type="text" id="missFeeID"/></li>
				<li><label>废票手续费  : </label><input name="invalidateFee" type="text" id="invalidateFeeID"/></li>
				<li><label>额外行李额手续费   : </label><input name="extraBaggageFee" type="text" id="extraBaggageFeeID"/></li>
			</ul>
		</form>
		<div class="modify_foot">
			<span id="modify_save" class="save" onclick="editSupplierFee()">保存</span>
			<span class="modify_cancel" onclick="hideSupplierFeeModal()">取消</span>
		</div>
	</div>
</div>