<%--
  Created by IntelliJ IDEA.
  User: liangyh
  Date: 7/26/16
  Time: 6:02 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- fr修改逻辑 -->
<div id="rule_FR_modify">
	<div class="modify_yy"></div>
	<div class="modify_content">
		<div class="modify_head">
			<p>修改FlightRoutes24手续费</p>
			<span class="modify_cancel" onclick="hideFeeModal()">X</span>
			<div class="clear"></div>
		</div>
		<form id="frFeeForm-ID">
			<ul class="modify_ul">
				<input name="whiteListId" type="hidden" id="frFeeID"/>
				<li><label>币种 <font color="red"> * </font> : </label><input name="currency" type="text" id="currencyID"/></li>
				<li><label>退票手续费  : </label><input name="refundFee" type="text" id="refundFeeID"/></li>
				<li><label>改签手续费  : </label><input name="changeFee" type="text" id="changeFeeID"/></li>
				<li><label>签转手续费  : </label><input name="signFee" type="text" id="signFeeID"/></li>
				<li><label>误机手续费  : </label><input name="missFee" type="text" id="missFeeID"/></li>
				<li><label>废票手续费  : </label><input name="invalidateFee" type="text" id="invalidateFeeID"/></li>
				<li><label>额外行李额手续费   : </label><input name="extraBaggageFee" type="text" id="extraBaggageFeeID"/></li>
			</ul>
		</form>
		<div class="modify_foot">
			<span id="FR_modify_cancel" class="save" onclick="updateFrFee()">保存</span>
			<span class="modify_cancel" onclick="hideFeeModal()">取消</span>
		</div>
	</div>
</div>