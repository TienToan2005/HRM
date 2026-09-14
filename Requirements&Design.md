## EMPLOYEE:
* Hồ sơ: Xem hồ sơ cá nhân, tự cập nhật thông tin (SĐT, địa chỉ).
* Nghỉ phép: Tạo đơn xin nghỉ phép (Leave Request) -> Xem trạng thái duyệt đơn.
* Chấm công: Check-in / Check-out mỗi ngày.
* Lương: Xem phiếu lương cá nhân của tháng trước.

## HR:
*   Hồ sơ: Tạo mới nhân viên (cấp tài khoản), sửa/xoá thông tin toàn bộ nhân viên.
*   Nghỉ phép: Xem lịch sử nghỉ phép của TOÀN BỘ công ty.
*   Chấm công & Lương: Tổng hợp công cuối tháng -> Bấm nút "Tính lương" -> Tạo ra phiếu lương cho toàn công ty.

## PRESIDENT:
* Nghỉ phép: Xem danh sách đơn xin nghỉ phép của nhân viên trong phòng ban mình -> Duyệt (Approve) hoặc Từ chối (Reject).
* (Manager cũng có các tính năng của Employee).

### MODULE 1: Authentication (/api/v1/auth)
Method	Endpoint	Body	Role	Mô tả
POST	/auth/login	{username, password}	Public	Đăng nhập, trả về JWT
POST	/auth/register	{username, password, email}	HR/ADMIN	Tạo tài khoản nhân viên mới
POST	/auth/refresh-token	{refreshToken}	Any	Lấy token mới khi hết hạn

### MODULE 2: User — Hồ Sơ Nhân Viên (/api/v1/users)
Method	Endpoint	Role	Mô tả
POST /users	HR	Tạo mới nhân viên
GET	/users	HR	Xem danh sách toàn bộ nhân viên
GET	/users/{id}	HR 	Xem chi tiết 1 nhân viên
GET	/users/me	Any	Nhân viên tự xem hồ sơ của mình
PATCH	/users/me	Any	Tự cập nhật SĐT, địa chỉ
PUT	/users/{id}	HR	HR chỉnh sửa hồ sơ nhân viên
DELETE	/users/{id}	HR	Soft Delete nhân viên nghỉ việc

### MODULE 3: Department — Phòng Ban (/api/v1/departments)
Method	Endpoint	Role	Mô tả
GET	/departments	Any	Xem danh sách phòng ban
POST	/departments	HR	Tạo phòng ban mới
PUT	/departments/{id}	HR	Sửa tên phòng ban
DELETE	/departments/{id}	HR	Xóa phòng ban

### MODULE 4: Leave Request — Nghỉ Phép (/api/v1/leave-requests)
Method	Endpoint	Role	Mô tả
POST	/leave-requests	EMPLOYEE	Tạo đơn xin nghỉ
GET	/leave-requests/me	EMPLOYEE	Xem lịch sử đơn của mình
GET	/leave-requests	HR/MANAGER	Xem tất cả đơn của công ty
PATCH	/leave-requests/{id}/approve	MANAGER	Duyệt đơn
PATCH	/leave-requests/{id}/reject	MANAGER	Từ chối đơn

### MODULE 5: Attendance — Chấm Công (/api/v1/attendance)
Method Endpoint   Role   Mô tả 
POST   /attendance/punch   DEVICE / EMPLOYEE  Ghi nhận 1 lần quét vân tay/khuôn mặt
GET    /attendance/me      EMPLOYEE     Xem danh sách lịch sử chấm công, giờ đi muộn, về sớm của cá nhân.
GET   /attendance   HR/ADMIN   Truy xuất toàn bộ dữ liệu chấm công của nhân sự trong công ty.
POST  /attendance/requests   EMPLOYEE    Nộp đơn xin giải trình bổ sung giờ (Punch Correction).
PUT    /attendance/requests/{id}/approve   MANAGER / HR   Phê duyệt đơn giải trình và tự động tính toán lại giờ công.
PUT  /attendance/requests/{id}/rejectMANAGER / HR     Từ chối đơn giải trình, giữ nguyên lỗi MISSING_CHECKOUT.
POST/attendance/recalculate     ADMIN / HR     Kích hoạt lại job tính công thủ công cho một ngày cụ thể.

### MODULE 6: Salary Slip — Phiếu Lương (/api/v1/salary-slips)
Method	Endpoint	Role	Mô tả
GET	/salary/me	EMPLOYEE	Xem phiếu lương của mình
GET	/salary	HR	Xem phiếu lương toàn công ty
POST	/salary-slips/generate	HR	Tính và tạo lương cho toàn bộ tháng
