const totalNumberImage = CONFIG.totalNumberImage;

let _id = undefined;
const listElement = document.getElementById("list_loiChuc");
const listNickName = document.getElementById("list_nickName");
const listImage = document.getElementById("listImage");

// const reloadButton = document.getElementById("reloadButton");
let selectedImageBase64 = null;
let updateButton = null;
let checkListNickName;



function openTab(tabId, button) {
  if (tabId === 'tab1') {
    loadMessages();
    listImage.innerHTML = "";
  } else if (tabId === 'tab2') {
    attachAnEventToTheForm();
    loadNickName();
  } else {
    loadImages();
  }
  // Ẩn tất cả nội dung
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });

  // Bỏ active tất cả button
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.classList.remove("active");
  });

  // Hiển thị tab được chọn
  document.getElementById(tabId).classList.add("active");

  // Active button được chọn
  button.classList.add("active");
}

// ========================================
// TẢI DANH SÁCH
// ========================================

async function loadMessages() {
  try {
    listElement.innerHTML = "Đang tải...";

    const response = await fetch("/api/data");

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không thể tải dữ liệu");
    }

    const data = result.data || [];

    // ------------------------------
    // Không có dữ liệu
    // ------------------------------
    const total_list = document.getElementById("total_loi_chuc");
    total_list.innerHTML = data?.length;

    if (data.length === 0) {
      listElement.innerHTML = `
                <div class="empty">
                Hãy là người đầu tiên gửi lời chúc! 💌
                </div>
            `;

      return;
    }

    listElement.innerHTML = "";

    // ------------------------------
    // Hiển thị từng lời chúc
    // ------------------------------

    data.forEach(item => {
      const element = document.createElement("div");

      element.className = "item";

      // =========================
      // NAME
      // =========================

      const name = document.createElement("div");

      name.className = "name";

      name.textContent = item.name;

      // =========================
      // MESSAGE
      // =========================

      const message = document.createElement("div");

      message.className = "message";

      message.textContent = item.message;

      // =========================
      // DATE
      // =========================

      const date = document.createElement("div");

      date.className = "date";

      if (item.createdAt) {
        date.textContent = new Date(item.createdAt).toLocaleString("vi-VN");
      }

      // =========================
      // DELETE
      // =========================

      const deleteButton = document.createElement("button");

      deleteButton.className = "delete-button";

      deleteButton.textContent = "Xóa";

      deleteButton.addEventListener("click", () => {
        deleteMessage(item.id);
      });

      // =========================
      // APPEND
      // =========================

      element.appendChild(name);

      element.appendChild(message);

      element.appendChild(date);

      element.appendChild(deleteButton);

      listElement.appendChild(element);
    });
  } catch (error) {
    console.error("LOAD ERROR:", error);

    listElement.innerHTML = "";

    const errorElement = document.createElement("div");

    errorElement.className = "empty";

    errorElement.textContent = "Lỗi: " + error.message;

    listElement.appendChild(errorElement);
  }
}

// ========================================
// XÓA
// ========================================

async function deleteMessage(id) {
  const confirmed = confirm("Bạn có chắc muốn xóa lời chúc này?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/data", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id: id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không thể xóa");
    }

    alert("Xóa thành công!");

    // Tải lại

    await loadMessages();
  } catch (error) {
    console.error("DELETE ERROR:", error);

    alert("Lỗi: " + error.message);
  }
}

// reloadButton.addEventListener("click", loadMessages);


function changeImage(album) {

  const resetButton = document.querySelectorAll(".update-button");

  resetButton.forEach(btn => {
    btn.style.display = "none";
  });

  _id = album?.id;
  updateButton = album.querySelector(".update-button");

  // 1. Tìm thẻ <img> bên trong album
  const img = album.querySelector("img");

  // 2. Tạo một thẻ <input type="file"> bằng JavaScript
  const input = document.createElement("input");

  // 3. Cho phép input này chọn file
  input.type = "file";

  // 4. Chỉ cho phép chọn hình ảnh
  input.accept = "image/*";

  // 5. Xử lý khi người dùng chọn một file
  input.onchange = function (event) {
    // 6. Lấy file đầu tiên mà người dùng chọn
    const file = event.target.files[0];

    // 7. Nếu người dùng không chọn file thì dừng
    if (!file) return;

    // ==============================
    // KIỂM TRA DUNG LƯỢNG ẢNH
    // ==============================

    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      alert("Ảnh không được lớn hơn 5 MB!");
      return;
    }

    // 8. Kiểm tra file có phải hình ảnh hay không
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file hình ảnh!");

      return;
    }

    // =====================================================
    // PHẦN 1: HIỂN THỊ ẢNH NGAY LẬP TỨC
    // =====================================================

    // 9. Tạo một URL tạm thời từ file
    const imageURL = URL.createObjectURL(file);

    // 10. Thay đổi src của thẻ <img>
    // Ảnh sẽ hiển thị ngay lập tức
    img.src = imageURL;

    // 11. Khi ảnh đã được hiển thị
    img.onload = function () {
      // 12. Xóa URL tạm thời khỏi bộ nhớ
      URL.revokeObjectURL(imageURL);
    };

    // =====================================================
    // PHẦN 2: CHUYỂN ẢNH SANG BASE64
    // =====================================================

    // 13. Tạo FileReader
    const reader = new FileReader();

    // 14. Xử lý khi FileReader đọc file xong
    reader.onload = function (e) {
      // 15. Lấy dữ liệu Base64
      const base64 = e.target.result;

      // 17. Ví dụ lưu Base64 vào album
      album.dataset.base64 = base64;
      updateButton.style.display = "block";

      // 18. Bạn cũng có thể sử dụng biến base64
      // để gửi lên API / Database
      //   console.log("Có thể lưu DB:", album.dataset.base64);
    };

    // 19. Bắt đầu đọc file dưới dạng Base64
    reader.readAsDataURL(file);
  };

  // 20. Mở cửa sổ chọn file
  input.click();
}
async function createImage(event, album, stt) {
  event.stopPropagation();
  updateButton.style.display = "none";
  const notification_img = document.getElementById("notification-image");

  if (_id === undefined || _id === 'undefined') {

    const base64 = album.dataset.base64;

    if (!base64) {
      alert("Không có ảnh mới để cập nhật!");

      return;
    }

    const response = await fetch("/api/data", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        type: "image",
        image: base64,
        stt: stt
      })
    });

    if (response?.ok === false && response?.status === 413) {
      return alert("Ảnh không được có dung lượng lớn!");
    }


    const result = await response.json();
    console.log('000-->', result)
    if (!response.ok) {
      throw new Error(result.message);
    } else {
      notification_img.style.display = "block";
      // Chờ 2s để Sheets kịp ghi rồi reload
      setTimeout(() => {

        notification_img.style.display = "none";

      }, 4000);
    }
  } else {
    updateImageAPI(album);
    notification_img.style.display = "block";
    // Chờ 2s để Sheets kịp ghi rồi reload
    setTimeout(() => {

      notification_img.style.display = "none";

    }, 4000);
  }


}

async function loadImages() {

  try {

    const response =
      await fetch(
        "/api/data?type=images"
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Không thể tải ảnh"
      );

    }
    let listData = [];

    for (let stt = 1; stt <= totalNumberImage; stt++) {

      const item = result?.data.find(
        item => Number(item.stt) === stt
      );

      if (item) {

        listData.push(item);

      } else {

        listData.push({
          stt: stt
        });

      }
    }

    createListImage(listData);
    return listData;


  } catch (error) {

    console.error(
      "LOAD IMAGES ERROR:",
      error
    );

    return [];

  }
}

// ========================================
// TẢI DANH SÁCH IMAGE
// ========================================

function createListImage(e) {
  listImage.innerHTML = "";

  e.forEach((item, stt) => {
    let index = stt + 1;
    const elementDiv = document.createElement("div");
    elementDiv.className = "album-item";
    elementDiv.id = item?.id
    const imgDiv = document.createElement("img");
    imgDiv.src = item?.image || '/images/noImage.png'

    const albumDiv = document.createElement("div");
    albumDiv.className = "album-placeholder";

    const albumNote = document.createElement("div");
    albumNote.className = "album-note";

    const btnCapNhat = document.createElement("button");
    btnCapNhat.className = "update-button";
    btnCapNhat.innerHTML = "Cập nhật";

    elementDiv.appendChild(imgDiv);
    albumDiv.appendChild(albumNote);
    elementDiv.appendChild(albumDiv)
    elementDiv.appendChild(btnCapNhat)
    // ===== Lay index anh
    albumNote.innerHTML = "Ảnh " + index;

    // Them chuc nang click vao anh
    imgDiv.addEventListener("click", (event) => {
      event.stopPropagation();
      changeImage(elementDiv);
    });

    // Them chuc nang click vao button
    btnCapNhat.addEventListener("click", (event) => {
      createImage(event, elementDiv, Number(index));
    });
    listImage.appendChild(elementDiv);
  });
}


async function updateImageAPI(album) {
  // --------------------------------
  // Lấy ID ảnh hiện tại
  // --------------------------------

  const id = _id;


  // --------------------------------
  // Lấy Base64 ảnh mới
  // --------------------------------

  const base64 =
    album.dataset.base64;
  // Kiểm tra ID
  if (!id) {

    alert(
      "Không tìm thấy ID ảnh!"
    );

    return;

  }


  // Kiểm tra Base64
  if (!base64) {

    alert(
      "Không có ảnh mới để cập nhật!"
    );

    return;

  }


  try {

    const response =
      await fetch(
        "/api/data",
        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              type:
                "image",

              id:
                id,

              image:
                base64

            })

        }
      );

    if (response?.ok === false && response?.status === 413) {
      console.log('=====>');
      return alert("Ảnh không được có dung lượng lớn!");
    }

    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Không thể cập nhật ảnh"
      );

    }

    const notification = document.getElementById("notification");
    notification.style.display = "block";
    // Chờ 2s để Sheets kịp ghi rồi reload
    setTimeout(() => {

      notification.style.display = "none";

    }, 4000);

    // Xóa Base64 tạm
    delete album.dataset.base64;


  } catch (error) {

    console.error(
      "UPDATE IMAGE ERROR:",
      error
    );


    alert(
      "Lỗi: " +
      error.message
    );

  }

}

async function createNickName(name, nickName) {

  const response = await fetch("/api/data", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name: name,
      type: "nickName",
      nickName: nickName
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  } else {

    const notification = document.getElementById("notification");
    notification.style.display = "block";
    // Chờ 2s để Sheets kịp ghi rồi reload
    setTimeout(() => {

      notification.style.display = "none";

    }, 4000);
  }

}


// ========================================
// XÓA NICKNAME
// ========================================

async function deleteNickName(id) {
  const confirmed = confirm("Bạn có chắc muốn xóa?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/data", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id: id,
        type: "nickName",
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không thể xóa");
    }

    alert("Xóa thành công!");

    // Tải lại

    await loadNickName();
  } catch (error) {
    console.error("DELETE ERROR:", error);

    alert("Lỗi: " + error.message);
  }
}

async function loadNickName() {
  listNickName.innerHTML = "";
  try {

    const response =
      await fetch(
        "/api/data?type=nickName"
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Không thể tải"
      );

    }

    const data = result.data || [];
    checkListNickName = data?.reverse();
    // ------------------------------
    // Không có dữ liệu
    // ------------------------------
    const total_list = document.getElementById("total_biet_danh");
    total_list.innerHTML = data?.length;

    if (data.length === 0) {
      listNickName.innerHTML = `
                <div class="empty">
                Chưa có dữ liệu!
                </div>
            `;

      return;
    }

    listNickName.innerHTML = "";

    // Dat gioi han cho phep
    const check_total = document.getElementById("btn_them_biet_danh");
    if (data?.length > CONFIG.limit_NickName) {
      check_total.disabled = true;
    } else {
      check_total.disabled = false;
    }




    // ------------------------------
    // Hiển thị nickname
    // ------------------------------

    data.forEach(item => {
      const element = document.createElement("div");

      element.className = "item";

      // =========================
      // NAME
      // =========================

      const name = document.createElement("div");

      name.className = "name";
      name.textContent = "Tên: " + item?.name;

      // =========================
      // MESSAGE
      // =========================

      const message = document.createElement("div");

      message.className = "message";

      message.textContent = "Biệt danh: " + item?.nickName;

      // =========================
      // DELETE
      // =========================

      const deleteButton = document.createElement("button");

      deleteButton.className = "delete-button";

      deleteButton.textContent = "Xóa";

      deleteButton.addEventListener("click", () => {
        deleteNickName(item.id);
      });

      // =========================
      // APPEND
      // =========================

      element.appendChild(name);

      element.appendChild(message);


      element.appendChild(deleteButton);

      listNickName.appendChild(element);
    });

    return;


  } catch (error) {

    console.error(
      "LOAD NICKNAME ERROR:",
      error
    );

    return [];

  }
}

function attachAnEventToTheForm() {

  const checkNameForm = document.getElementById("notification-error-name");
  const checkNickNameForm = document.getElementById("notification-error-nickName");
  // Gắn sự kiện form NICK NAME
  const gbNickNameForm = document.getElementById("nickNameForm");
  if (gbNickNameForm) {
    gbNickNameForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("gbTen").value.trim();
      const nickName = document.getElementById("gbBietDanh").value.trim();

      if (!name || !nickName) return;
      const checkName = checkListNickName.find(item => item?.name === name);
      if (checkName) {
        checkNameForm.style.display = "block";
        return;
      }
      const checkValueNickName = checkListNickName.find(item => item?.nickName === nickName);
      if (checkValueNickName) {
        checkNameForm.style.display = "none";
        checkNickNameForm.style.display = "block";
        return;
      }

      if (name.length > 100 || nickName.length > 200) {
        alert("Tên tối đa 100 ký tự, Biệt danh tối đa 200 ký tự.");
        return;
      }
      const btn = gbNickNameForm.querySelector(".btn-create");
      btn.disabled = true;
      btn.textContent = "⏳ Đang gửi...";

      createNickName(name, nickName)
        .then(() => {
          gbNickNameForm.reset();
          document.getElementById("gbTen").focus();
        })
        .catch(() => alert("Không thể Thêm. Vui lòng thử lại!"))
        .finally(() => {
          btn.disabled = false;
          btn.textContent = "Thêm";
          checkNickNameForm.style.display = "none";
          checkNameForm.style.display = "none";

          loadNickName();
        });
    });
  }

}

loadMessages()