SIMS - Smart Invoice Management System

Đây là một hệ thống quản lý hoá đơn thông minh. Sử dụng công nghệ AI để tự động nhận diện chữ viết tay từ hoá đơn trích xuất thông tin và lưu trữ vào cơ sở dữ liệu và tạo ra các báo cáo thống kê, đối chiếu và phân tích các thông tin hoá đơn.

Tech stack:
- Backend: Nestjs, TypeORM, Postgres, Langchain, Gemini
- FrontendL Reactjs, React Query, Tailwind CSS
- Deployment: Docker, Nginx, Docker Compose

Chi tiết các tính năng:
- Đăng nhập, đăng ký cơ bản với username, password(Sử dụng JWT)
- Quản lý danh sách hoá đơn được tạo
    -   Tìm kiếm theo tên khách hàng, số hoá đơn, ngày tạo
    -   Xem thông tin chi tiết hoá đơn
    -   Tạo link đối chiếu hoá đơn (Link này dành cho khách hàng để đối chiếu hoá đơn)
- Tạo mới hoá đơn
    -   Tự động nhận diện thông tin hoá đơn từ ảnh hoá đơn (Cho phép user chụp ảnh từ camera hoặc chọn ảnh từ thư viện)
    -   Sau khi trích xuất thông tin hoá đơn, hệ thống sẽ tạo một bản draft hoá đơn, chia 2 tab là hình ảnh chụp và thông tin ghi nhận được để người dùng đối chiếu dữ liệu. Cho phép user chỉnh sửa thông tin hoá đơn, nếu thông tin hoá đơn chính xác, user có thể lưu lại hoá đơn vào database
    -   Trong hoá đơn chứa tên khách hàng, hệ thống sẽ tìm kiếm trong danh sách khách hàng, nếu tìm thấy sẽ tự động gán khách hàng vào hoá đơn, nếu không tìm thấy sẽ tạo khách hàng mới
    -   Trong hoá đơn chứa tên dự án, hệ thống sẽ tìm kiếm trong danh sách dự án, nếu tìm thấy sẽ tự động gán dự án vào hoá đơn, nếu không tìm thấy sẽ tạo dự án mới
    -   Trong hoá đơn chứa tên sản phẩm, hệ thống sẽ tìm kiếm trong danh sách sản phẩm, nếu tìm thấy sẽ tự động gán sản phẩm vào hoá đơn, nếu không tìm thấy sẽ tạo sản phẩm mới
- Chỉnh sửa hoá đơn
    -   Cho phép user chỉnh sửa thông tin hoá đơn, nếu thông tin hoá đơn chính xác, user có thể lưu lại hoá đơn vào database
- Xem thông tin chi tiết hoá đơn
    -   Cho phép user xem thông tin chi tiết hoá đơn
    -   Cho phép user hiển thị nút mở hình ảnh hoá đơn để đối chiếu dữ liệu
- Quản lý danh sách dự án
    -   Cho phép user tạo mới dự án
    -   Cho phép user chỉnh sửa thông tin dự án
    -   Cho phép user xem thông tin chi tiết dự án
    -   Cho phép user xem danh sách hoá đơn thuộc dự án
    -   Tạo link đối chiếu dự án (Link này dành cho khách hàng để đối chiếu dự án)
- Tạo mới dự án
    -   Cho phép user tạo mới dự án (Cho phép user chọn ảnh từ thư viện hoặc chụp ảnh từ camera)
    -   Tự dộng nhận diện thông tin dự án từ ảnh dự án
    -   Sau khi trích xuất thông tin dự án, hệ thống sẽ tạo một bản draft dự án, chia 2 tab là hình ảnh chụp và thông tin ghi nhận được để người dùng đối chiếu dữ liệu. Cho phép user chỉnh sửa thông tin dự án, nếu thông tin dự án chính xác, user có thể lưu lại dự án vào database
    -   Trong dự án chứa tên khách hàng, hệ thống sẽ tìm kiếm trong danh sách khách hàng, nếu tìm thấy sẽ tự động gán khách hàng vào dự án, nếu không tìm thấy sẽ tạo khách hàng mới
    
- Chỉnh sửa dự án
    -   Cho phép user chỉnh sửa thông tin dự án
    -   Cho phép user xem thông tin chi tiết dự án
    -   Cho phép user xem danh sách hoá đơn thuộc dự án
    -   Cho phép user xem link đối chiếu dự án
- Xem thông tin chi tiết dự án
    -   Cho phép user xem thông tin chi tiết dự án
    -   Cho phép user xem danh sách hoá đơn thuộc dự án
    -   Cho phép user xem link đối chiếu dự án
- Xem danh sách hoá đơn thuộc dự án
    -   Cho phép user xem danh sách hoá đơn thuộc dự án
- Quản lý danh sách sản phầm
    -   Cho phép user tạo mới sản phẩm
    -   Cho phép user chỉnh sửa thông tin sản phẩm
    -   Cho phép user xem thông tin chi tiết sản phẩm
    -   Cho phép user xem danh sách hoá đơn thuộc sản phẩm
- Tạo mới sản phẩm
    -   Cho phép user tạo mới sản phẩm
- Chỉnh sửa sản phẩm
    -   Cho phép user chỉnh sửa thông tin sản phẩm
    -   Cho phép user xem thông tin chi tiết sản phẩm
    -   Cho phép user xem danh sách hoá đơn thuộc sản phẩm
- Xem thông tin chi tiết sản phẩm
    -   Cho phép user xem thông tin chi tiết sản phẩm
    -   Cho phép user xem danh sách hoá đơn thuộc sản phẩm
- Xem danh sách hoá đơn thuộc sản phẩm
    -   Cho phép user xem danh sách hoá đơn thuộc sản phẩm
- Quản lý danh sách khách hàng
    -   Cho phép user tạo mới khách hàng
    -   Cho phép user chỉnh sửa thông tin khách hàng
    -   Cho phép user xem thông tin chi tiết khách hàng
    -   Cho phép user xem danh sách hoá đơn thuộc khách hàng
- Tạo mới khách hàng
    -   Cho phép user tạo mới khách hàng
- Chỉnh sửa khách hàng
    -   Cho phép user chỉnh sửa thông tin khách hàng
    -   Cho phép user xem thông tin chi tiết khách hàng
    -   Cho phép user xem danh sách hoá đơn thuộc khách hàng
- Xem thông tin chi tiết khách hàng
    -   Cho phép user xem thông tin chi tiết khách hàng
    -   Cho phép user xem danh sách hoá đơn thuộc khách hàng
- Xem danh sách hoá đơn thuộc khách hàng
    -   Cho phép user xem danh sách hoá đơn thuộc khách hàng

Thôn tin hoá đơn:
- Tên khách hàng
- Địa chỉ
- Sản phẩm
    - Tên sản phẩm
    - Số lượng
    - Đơn giá
    - Tổng tiền
- Tổng tiền
- Ngày tạo
- Nợ
- Trả
- Trạng thái
    - Chờ thanh toán
    - Đã thanh toán
    - Đã hủy
- Hình ảnh hoá đơn
Lưu ý:
- Không tạo document trong source code
- Không comment trong code
- Không tạo các icon bằng text
    
    