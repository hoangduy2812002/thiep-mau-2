import { put, list, get, del } from "@vercel/blob";

// ========================================
// CẤU HÌNH
// ========================================

const DIRECTORY = "messages/";
const IMAGE_DIRECTORY = "images/";
const NICKNAME_DIRECTORY = "nickname/";

// ========================================
// ĐỌC MỘT BLOB
// ========================================

async function readBlob(pathname) {
  const result = await get(pathname, {
    access: "private"
  });

  if (!result) {
    return null;
  }

  const text = await new Response(result.stream).text();

  return JSON.parse(text);
}

// ========================================
// LẤY DANH SÁCH
// ========================================

async function getMessages() {
  const result = await list({
    prefix: DIRECTORY
  });

  const data = [];

  for (const blob of result.blobs) {
    try {
      const item = await readBlob(blob.pathname);

      if (!item) {
        continue;
      }

      data.push({
        // Đây chính là ID
        // dùng để sửa và xóa
        id: blob.pathname,

        name: item.name,

        message: item.message,

        createdAt: item.createdAt || null
      });
    } catch (error) {
      console.error("READ ERROR:", blob.pathname, error);
    }
  }

  // Mới nhất lên đầu

  data.reverse();

  return data;
}

// ========================================
// THÊM
// ========================================

async function addMessage(name, message) {
  // Tạo tên file duy nhất

  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const pathname = `${DIRECTORY}${id}.json`;

  // Dữ liệu lưu

  const data = {
    name: name.trim(),

    message: message.trim(),

    createdAt: new Date().toISOString()
  };

  // Tạo Blob mới

  const blob = await put(pathname, JSON.stringify(data, null, 4), {
    access: "private",

    contentType: "application/json"
  });

  return {
    id: blob.pathname,

    ...data
  };
}

// ========================================
// SỬA
// ========================================

async function updateMessage(id, name, message) {
  // ------------------------------------
  // Kiểm tra ID
  // ------------------------------------

  if (
    typeof id !== "string" ||
    !id.startsWith(DIRECTORY) ||
    !id.endsWith(".json")
  ) {
    throw new Error("ID không hợp lệ");
  }

  // ------------------------------------
  // Đọc Blob cũ
  // ------------------------------------

  const oldData = await readBlob(id);

  if (!oldData) {
    throw new Error("Không tìm thấy dữ liệu");
  }

  // ------------------------------------
  // Tạo dữ liệu mới
  // ------------------------------------

  const newData = {
    name: name.trim(),

    message: message.trim(),

    // Giữ ngày tạo ban đầu
    createdAt: oldData.createdAt || new Date().toISOString()
  };

  // ------------------------------------
  // Ghi đè Blob cũ
  // ------------------------------------

  await put(id, JSON.stringify(newData, null, 4), {
    access: "private",

    contentType: "application/json",

    allowOverwrite: true
  });

  return {
    id: id,

    ...newData
  };
}

// ========================================
// XÓA
// ========================================

async function deleteMessage(id) {
  // ------------------------------------
  // Kiểm tra ID
  // ------------------------------------

  if (
    typeof id !== "string" ||
    !id.startsWith(DIRECTORY) ||
    !id.endsWith(".json")
  ) {
    throw new Error("ID không hợp lệ");
  }

  // ------------------------------------
  // Xóa Blob
  // ------------------------------------

  await del(id);
}

// ========================================
// THÊM ẢNH BASE64
// ========================================

async function addImage(base64, stt) {
  // Kiểm tra Base64

  if (typeof base64 !== "string" || !base64.startsWith("data:image/")) {
    throw new Error("Dữ liệu hình ảnh không hợp lệ");
  }

  // Tạo ID duy nhất

  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  // Tạo đường dẫn

  const pathname = `${IMAGE_DIRECTORY}${id}.json`;

  // Dữ liệu lưu

  const data = {
    image: base64,
    stt: stt,
    createdAt: new Date().toISOString()
  };

  // Lưu JSON vào Vercel Blob

  const blob = await put(pathname, JSON.stringify(data, null, 4), {
    access: "private",

    contentType: "application/json"
  });

  return {
    id: blob.pathname,

    ...data
  };
}

// ========================================
// CẬP NHẬT ẢNH BASE64
// ========================================

async function updateImage(
  id,
  base64,
) {

  // ------------------------------------
  // Kiểm tra ID
  // ------------------------------------

  if (
    typeof id !== "string" ||
    !id.startsWith(IMAGE_DIRECTORY) ||
    !id.endsWith(".json")
  ) {

    throw new Error(
      "ID ảnh không hợp lệ"
    );

  }


  // ------------------------------------
  // Kiểm tra Base64
  // ------------------------------------

  if (
    typeof base64 !== "string" ||
    !base64.startsWith("data:image/")
  ) {

    throw new Error(
      "Dữ liệu ảnh không hợp lệ"
    );

  }


  // ------------------------------------
  // Đọc dữ liệu ảnh cũ
  // ------------------------------------

  const oldData =
    await readBlob(id);


  if (!oldData) {

    throw new Error(
      "Không tìm thấy ảnh"
    );

  }


  // ------------------------------------
  // Tạo dữ liệu mới
  // ------------------------------------

  const newData = {

    image:
      base64,

    // Giữ stt va ngày tạo cũ
    stt: oldData.stt,
    createdAt:
      oldData.createdAt ||
      new Date().toISOString()

  };


  // ------------------------------------
  // Ghi đè Blob
  // ------------------------------------

  await put(

    id,

    JSON.stringify(
      newData,
      null,
      4
    ),

    {

      access:
        "private",

      contentType:
        "application/json",

      allowOverwrite:
        true

    }

  );


  // ------------------------------------
  // Trả kết quả
  // ------------------------------------

  return {

    id:
      id,

    ...newData

  };

}
// ========================================
// LẤY DANH SÁCH ẢNH
// ========================================

async function getImages() {
  const result = await list({
    prefix: IMAGE_DIRECTORY
  });

  const data = [];

  for (const blob of result.blobs) {
    try {
      const item = await readBlob(blob.pathname);

      if (!item) {
        continue;
      }

      data.push({
        // ID của ảnh
        id: blob.pathname,

        // Base64
        image: item?.image,

        stt: item?.stt,

        // Ngày tạo
        createdAt: item?.createdAt || null
      });
    } catch (error) {
      console.error("READ IMAGE ERROR:", blob.pathname, error);
    }
  }

  // Ảnh mới nhất lên đầu

  // data.reverse();

  return data;
}

// ========================================
// LẤY DANH SÁCH NICKNAME
// ========================================

async function getNickName() {

  const result = await list({
    prefix: NICKNAME_DIRECTORY
  });

  const data = [];

  for (const blob of result.blobs) {
    try {
      const item = await readBlob(blob.pathname);

      if (!item) {
        continue;
      }

      data.push({
        // Đây chính là ID
        id: blob.pathname,
        name: item.name,
        nickName: item.nickName,
      });
    } catch (error) {
      console.error("READ ERROR:", blob.pathname, error);
    }

  }
  return data;

}

// ========================================
// API HANDLER
// ========================================

export default async function handler(req, res) {
  try {
    // =================================
    // GET
    // =================================
    if (req.method === "GET") {
      // ==============================
      // LẤY IMAGES
      // ==============================

      if (req.query.type === "images") {
        const data = await getImages();

        return res.status(200).json({
          success: true,

          data: data
        });
      }

      // ==============================
      // LẤY NICKNAME
      // ==============================

      if (req.query.type === "nickName") {
        const data = await getNickName();

        return res.status(200).json({
          success: true,

          data: data
        });
      }


      // ==============================
      // LẤY MESSAGES
      // ==============================

      const data = await getMessages();

      return res.status(200).json({
        success: true,

        data: data
      });
    }

    // =================================
    // POST
    // =================================

    if (req.method === "POST") {
      const { type, image, stt, name, message,nickName } = req.body || {};

      // =================================
      // LƯU ẢNH BASE64
      // =================================

      if (type === "image") {
        if (typeof image !== "string" || !image.startsWith("data:image/")) {
          return res.status(400).json({
            success: false,

            message: "Ảnh không hợp lệ"
          });
        }

        const data = await addImage(image, stt);

        return res.status(201).json({
          success: true,

          message: "Lưu ảnh thành công",

          data: data
        });
      }


      if (type === 'nickName') {
        const data = await addNickName(name, nickName);

        return res.status(201).json({
          success: true,

          message: "Thêm thành công Biệt danh",

          data: data
        });
      }

      // Kiểm tra tên
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,

          message: "Tên không được để trống"
        });
      }
      const data = await addMessage(name, message);

      return res.status(201).json({
        success: true,

        message: "Thêm thành công",

        data: data
      });
    }

    // =================================
    // PUT
    // =================================

    if (req.method === "PUT") {
      // const { id, name, message } = req.body || {};
      const {
        type,
        id,
        image,
        // name,
        // message
      } =
        req.body || {};


      // =================================
      // CẬP NHẬT ẢNH
      // =================================

      if (
        type === "image"
      ) {

        if (
          typeof id !== "string"
        ) {

          return res.status(400).json({

            success:
              false,

            message:
              "Thiếu ID ảnh"

          });

        }


        if (
          typeof image !== "string" ||
          !image.startsWith("data:image/")
        ) {

          return res.status(400).json({

            success:
              false,

            message:
              "Ảnh không hợp lệ"

          });

        }


        const data =
          await updateImage(
            id,
            image
          );


        return res.status(200).json({

          success:
            true,

          message:
            "Cập nhật ảnh thành công",

          data:
            data

        });

      }


      // Kiểm tra ID

      // if (typeof id !== "string") {
      //   return res.status(400).json({
      //     success: false,

      //     message: "Thiếu ID"
      //   });
      // }

      // // Kiểm tra tên

      // if (typeof name !== "string" || !name.trim()) {
      //   return res.status(400).json({
      //     success: false,

      //     message: "Tên không được để trống"
      //   });
      // }

      // // Kiểm tra lời chúc

      // if (typeof message !== "string" || !message.trim()) {
      //   return res.status(400).json({
      //     success: false,

      //     message: "Lời chúc không được để trống"
      //   });
      // }

      // const data = await updateMessage(id, name, message);

      // return res.status(200).json({
      //   success: true,

      //   message: "Sửa thành công",

      //   data: data
      // });
    }

    // =================================
    // DELETE
    // =================================

    if (req.method === "DELETE") {
      const { id, type } = req.body || {};

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,

          message: "Thiếu ID"
        });
      }

      if (type === 'nickName') {
        await deleteNickName(id);
      } else {
        await deleteMessage(id);
      }
      return res.status(200).json({
        success: true,

        message: "Xóa thành công"
      });


    }

    // =================================
    // METHOD KHÔNG HỖ TRỢ
    // =================================

    return res.status(405).json({
      success: false,

      message: "Method không được hỗ trợ"
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message
    });
  }
}


async function addNickName(name, nickName) {
  // Tạo tên file duy nhất

  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const pathname = `${NICKNAME_DIRECTORY}${id}.json`;

  // Dữ liệu lưu

  const data = {
    name: name.trim(),

    nickName: nickName.trim(),

    createdAt: new Date().toISOString()
  };

  // Tạo Blob mới

  const blob = await put(pathname, JSON.stringify(data, null, 4), {
    access: "private",

    contentType: "application/json"
  });

  return {
    id: blob.pathname,

    ...data
  };
}


// ========================================
// XÓA NICKNAME
// ========================================

async function deleteNickName(id) {
  // ------------------------------------
  // Kiểm tra ID
  // ------------------------------------

  if (
    typeof id !== "string" ||
    !id.startsWith(NICKNAME_DIRECTORY) ||
    !id.endsWith(".json")
  ) {
    throw new Error("ID không hợp lệ");
  }

  // ------------------------------------
  // Xóa Blob
  // ------------------------------------

  await del(id);
}