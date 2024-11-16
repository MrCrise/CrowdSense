import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

# Bot token can be obtained via https://t.me/BotFather
TOKEN = "8151127954:AAFPMLTgJ20VK-ulxXb3MBzz9H1WyoGxiDA"

# All handlers should be attached to the Router (or Dispatcher)

dp = Dispatcher()


if sys.platform == 'win32':
	asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
     markup = ReplyKeyboardMarkup(
          keyboard = [
               [
                    KeyboardButton(
                         text = "Открыть",
                         web_app = WebAppInfo(url = f"https://mrcrise.github.io/")
                    )
               ]
          ],
          resize_keyboard=True
     )
     await message.answer("Нажми на кнопку, чтобы открыть приложение", reply_markup=markup)


async def main() -> None:
    # Initialize Bot instance with default bot properties which will be passed to all API calls
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    # And the run events dispatching
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())